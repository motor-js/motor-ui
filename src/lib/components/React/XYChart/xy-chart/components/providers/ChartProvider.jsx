import React from "react";
import { localPoint } from "@vx/event";
import { scaleOrdinal } from "@vx/scale";

import theme from "../../../../../../themes/defaultTheme";

const {
  xyChart: { defaultTheme },
} = theme;

import ChartContext from "../../context/ChartContext";
import createScale from "../../createScale";
import findNearestDatumXY from "../../util/findNearestDatumXY";

export default class ChartProvider extends React.Component {
  static defaultProps = {
    theme: defaultTheme,
  };

  state = {
    dataRegistry: {},
    margin: { top: 30, right: 30, bottom: 30, left: 30 },
    xScale: null,
    yScale: null,
    colorScale: null,
    width: null,
    height: null,
    combinedData: [],
    // selectionIds: [],
  };

  componentDidUpdate(prevProps) {
    if (
      // @TODO better solution
      JSON.stringify(this.props.xScale) !== JSON.stringify(prevProps.xScale) ||
      JSON.stringify(this.props.yScale) !== JSON.stringify(prevProps.yScale) ||
      JSON.stringify(this.props?.theme?.colors) !==
        JSON.stringify(prevProps?.theme?.colors)
    ) {
      this.updateScales();
    }
  }

  /** Adds data to the registry and to combined data if it supports events. */
  registerData = (dataToRegister) => {
    this.setState((state) => {
      const nextState = {
        ...state,
        dataRegistry: {
          ...state.dataRegistry,
          ...Object.values(dataToRegister).reduce(
            (combined, curr) => ({
              ...combined,
              [curr.key]: {
                ...curr,
                mouseEvents: curr.mouseEvents !== false,
              },
            }),
            {}
          ),
        },
        combinedData: [
          ...state.combinedData,
          ...Object.values(dataToRegister).reduce(
            (combined, curr) => [
              ...combined,
              ...curr.data.map((datum, index) => ({
                key: curr.key,
                datum,
                index,
              })),
            ],
            []
          ),
        ],
      };

      // it's important that the registry and scales are kept in sync so that
      // consumers don't used mismatched data + scales
      return {
        ...nextState,
        ...this.getScales(nextState),
      };
    });
  };

  /** Removes data from the registry and combined data. */
  unregisterData = (keyOrKeys) => {
    const keys = new Set(
      typeof keyOrKeys === "string" ? [keyOrKeys] : keyOrKeys
    );
    this.setState((state) => {
      const dataRegistry = Object.entries(state.dataRegistry).reduce(
        (accum, [key, value]) => {
          if (!keys.has(key)) accum[key] = value;
          return accum;
        },
        {}
      );

      const nextState = {
        ...state,
        dataRegistry,
        combinedData: state.combinedData.filter((d) => !keys.has(d.key)),
      };

      return {
        ...nextState,
        ...this.getScales(nextState),
      };
    });
  };

  /** Sets chart dimensions. */
  setChartDimensions = ({ width, height, margin }) => {
    if (width > 0 && height > 0) {
      this.setState({ width, height, margin }, this.updateScales);
    }
  };

  getScales = ({ combinedData, dataRegistry, margin, width, height }) => {
    const {
      theme,
      xScale: xScaleConfig,
      yScale: yScaleConfig,
      colorScale: colorScaleConfig,
    } = this.props;

    if (width == null || height == null) return;

    let xScale = createScale({
      data: combinedData.map(({ key, datum }) =>
        dataRegistry[key]?.xAccessor(datum)
      ),
      scaleConfig: xScaleConfig,
      range: [margin.left, width - margin.right],
    });

    let yScale = createScale({
      data: combinedData.map(({ key, datum }) =>
        dataRegistry[key]?.yAccessor(datum)
      ),
      scaleConfig: yScaleConfig,
      range: [height - margin.bottom, margin.top],
    });

    const colorScale = scaleOrdinal({
      domain: Object.keys(dataRegistry),
      range: theme.colors,
      ...colorScaleConfig,
    });

    // apply any updates to the scales from the registry
    // @TODO this order currently overrides any changes from x/yScaleConfig
    Object.values(dataRegistry).forEach((registry) => {
      if (registry.xScale) xScale = registry.xScale(xScale);
      if (registry.yScale) yScale = registry.yScale(yScale);
    });

    return { xScale, yScale, colorScale };
  };

  updateScales = () => {
    const { width, height } = this.state;

    if (width != null && height != null) {
      this.setState((state) => this.getScales(state));
    }
  };

  /**  */
  findNearestData = (event) => {
    const { width, height, margin, xScale, yScale, dataRegistry } = this.state;

    // for each series find the datums with closest x and y
    const closestData = {};
    let closestDatum = null;
    let minDistance = Number.POSITIVE_INFINITY;
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};

    if (xScale && yScale && svgMouseX != null && svgMouseY != null) {
      Object.values(dataRegistry).forEach(
        ({
          key,
          data,
          xAccessor,
          yAccessor,
          elAccessor,
          mouseEvents,
          findNearestDatum = findNearestDatumXY,
        }) => {
          // series has mouse events disabled
          if (!mouseEvents) return;

          const nearestDatum = findNearestDatum({
            event,
            svgMouseX,
            svgMouseY,
            xScale,
            yScale,
            xAccessor,
            yAccessor,
            elAccessor,
            data,
            width,
            height,
            margin,
            key,
          });

          if (nearestDatum) {
            const { datum, index, distanceX, distanceY } = nearestDatum;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            closestData[key] = { key, datum, index };
            closestDatum =
              distance < minDistance ? closestData[key] : closestDatum;
            minDistance = Math.min(distance, minDistance);
          }
        }
      );
    }

    return { closestData, closestDatum, svgMouseX, svgMouseY };
  };

  // formatValue = (val) => {
  //   const { roundNum, precision } = this.props;
  //   let formattedValue = roundNum
  //     ? roundNumber(Math.abs(val), precision)
  //     : Math.abs(val);

  //   return val < 0 ? `-${formattedValue}` : formattedValue;
  // };

  handleClick = (selectionValue) => {
    this.props.beginSelections();

    this.props.setCurrentSelectionIds(selectionValue);

    // this.setState({
    //   selectionIds: selectionValue,
    // });

    this.props.select(0, selectionValue);
  };

  render() {
    const {
      theme,
      chartType,
      showLabels,
      showPoints,
      dimensionInfo,
      measureInfo,
      dataKeys,
      // beginSelections,
      // setCurrentSelectionIds,
      // select,
      currentSelectionIds,
      singleDimension,
      singleMeasure,
      formatValue,
    } = this.props;

    // console.log(currentSelectionIds);
    // if (!currentSelectionIds) {
    //   this.setState({
    //     selectionIds: [],
    //   });
    // }

    const {
      width,
      height,
      margin,
      xScale,
      yScale,
      colorScale,
      dataRegistry,
      // selectionIds,
    } = this.state;
    return (
      <ChartContext.Provider
        value={{
          xScale,
          yScale,
          colorScale,
          width,
          height,
          margin,
          theme,
          chartType,
          dataRegistry,
          showLabels,
          showPoints,
          dimensionInfo,
          measureInfo,
          dataKeys,
          singleDimension,
          singleMeasure,
          // selectionIds,
          // beginSelections,
          // setCurrentSelectionIds,
          // select,
          currentSelectionIds,
          handleClick: this.handleClick,
          registerData: this.registerData,
          unregisterData: this.unregisterData,
          setChartDimensions: this.setChartDimensions,
          setNumberFormat: this.setNumberFormat,
          findNearestData: this.findNearestData,
          // formatValue: this.formatValue,
          formatValue,
        }}
      >
        {this.props.children}
      </ChartContext.Provider>
    );
  }
}
