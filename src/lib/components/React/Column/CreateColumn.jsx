import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';
import {
  addTitle,
  addSubTitle,
  addLegend,
  addTooltip,
  showTooltip,
  hideTooltip,
} from '../../D3';

import { setStyle } from '../../D3/Helpers';
import {
  roundNumber,
  hyperCubeTransform,
  getMeasureNames,
  groupHyperCubeData,
  stackHyperCubeData,
  colorByExpression,
} from '../../../utils';

export default function CreateColumn({
  qLayout,
  qData,
  // propsWidth,
  propsHeight,
  d3Container,
  screenWidth,

  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionColumnVisible,
  // buildSelections,
  selections,
  select,
  stacked,
  percentStacked,
  title,
  subTitle,
  showLegend,
  allowSelections,
  maxWidth,
  showAxis,
  maxAxisLength,
  ColumnThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  showLabels,
  allowZoom,
  suppressScroll,
  columnPadding,
  textOnAxis,
  tickSpacing,
  showGridlines,
} = chartSettings) {
  const { qDimensionInfo, qMeasureInfo } = qLayout.qHyperCube;
  const qDimensionCount = qDimensionInfo.length;
  const measureStartPosition = qDimensionCount * 2;
  const qMeasureCount = qMeasureInfo.length;
  const { qMatrix } = qData;
  const qItems = qMatrix.length;

  const { TooltipWrapper, TooltipShowStyle, TooltipHideStyle } = ToolTipThemes;
  const {
    LegendWrapper,
    LegendTextStyle,
    LegendGroup,
    ArrowStyle,
    ArrowDisabledStyle,
  } = LegendThemes;

  const { TitleStyle, SubTitleStyle } = TitleThemes;

  const {
    ColumnChartStyle,
    ColumnDefault,
    ColumnStyle,
    GridLineStyle,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    ColumnLabelStyle,
    ColumnOverviewColumn,
    SelectedColumn,
    NonSelectedColumn,
    colorPalette,
  } = ColumnThemes;

  const chartDataShape =
    qDimensionInfo.length === 1 && qMeasureInfo.length === 1
      ? 'singleDimensionMeasure'
      : qDimensionInfo.length == 1
      ? 'singleDimension'
      : percentStacked
      ? 'percentStacked'
      : stacked
      ? 'stackedChart'
      : 'multipleDimensions';

  const isPercentage = chartDataShape === 'percentStacked';
  let pendingSelections = [];

  let qMax = Math.max(0, ...qMeasureInfo.map((d) => d.qMax));
  let qMin = Math.min(0, ...qMeasureInfo.map((d) => d.qMin));

  const delayMilliseconds = 1500;
  const selectorHeight = 70;

  let height;
  let heightOverview;
  let xAxisOrientation = 'Standard';

  const uuid = uuidv4();

  // Check if width is % or number in px
  // let width = /^\d+(\.\d+)?%$/.test(propsWidth)
  //   ? (+parseInt(propsWidth, 10) / 100) * screenWidth
  //   : +parseInt(propsWidth, 10);
  let width = screenWidth;

  // Check if height is % or number in px
  const heightValue = /^\d+(\.\d+)?%$/.test(propsHeight)
    ? (+parseInt(propsHeight, 10) / 100) * window.innerHeight
    : +parseInt(propsHeight, 10);

  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 50,
  };

  if (['both', 'yAxis'].some((substring) => textOnAxis.includes(substring)))
    margin.left += 10;

  if (
    qMeasureInfo[0].qNumFormat.qType !== 'U' &&
    qMeasureInfo[0].qNumFormat.qFmt.includes('%')
  )
    margin.left += 20;

  const marginOverview = {
    top: +parseInt(heightValue, 10) - selectorHeight,
    right: 10,
    bottom: 20,
    left: margin.left,
  };

  const qDataSet = hyperCubeTransform(qData, qLayout.qHyperCube);

  const svgWidth = width;

  d3.select(d3Container.current)
    .select('svg')
    .remove();

  const svg = d3
    .select(d3Container.current)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', heightValue);

  setStyle(svg, ColumnChartStyle);

  let rangeBands = [];
  let data = qDataSet;

  let paddingShift = 0;

  const getDimensionCategories = (data) => [
    ...new Set(data.map((d) => d[Object.keys(d)[2]])),
  ];

  let categories = null;
  let items = null;

  switch (chartDataShape) {
    case 'singleDimensionMeasure':
      rangeBands = data.map((d) => d[Object.keys(d)[0]]);
      break;
    case 'singleDimension':
      rangeBands = getMeasureNames(qLayout.qHyperCube);
      break;
    case 'multipleDimensions':
      [data, rangeBands, paddingShift] = groupHyperCubeData(data);
      categories = getDimensionCategories(data);
      items = [...new Set(rangeBands.map((d) => d.split('|')[0]))];

      break;
    case 'stackedChart':
    case 'percentStacked':
      [data, rangeBands] = stackHyperCubeData(data, isPercentage);

      qMax = Math.max(0, ...data.map((d) => d.total));
      qMin = Math.min(0, ...data.map((d) => d.total));
      break;
  }

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(
    qLayout.qHyperCube,
    qMatrix,
    colorPalette
  );

  const color = d3.scaleOrdinal(
    conditionalColors.length !== 0 ? conditionalColors : colorPalette
  );

  const { legendWidth, legendHeight } = addLegend({
    showLegend: conditionalColors.length === 0 ? showLegend : 'none',
    svg,
    dataKeys: categories || rangeBands,
    color,
    margin,
    LegendWrapper,
    LegendTextStyle,
    LegendGroup,
    ArrowStyle,
    ArrowDisabledStyle,
  });

  const maxColumnWidth = maxWidth || ColumnDefault.maxWidth;

  const legendLeftPadding = legendWidth !== 0 ? margin.right : 0;

  width = width - margin.left - margin.right - legendWidth;

  const xScale = d3
    .scaleLinear()
    .range([0, width - margin.right - legendLeftPadding])
    .domain([0, data.length]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize([])
    .tickPadding(10)
    .tickValues(d3.range(0, data.length, 1));

  const xOverview = d3
    .scaleLinear()
    .domain(xScale.domain())
    .range(xScale.range());

  const xAxisOverview = d3
    .axisBottom(xScale)
    .tickValues([])
    .tickSize([]);
  let xOverviewSecondary = null;

  const xScaleSecondary = d3.scaleBand();

  let padding = columnPadding || ColumnDefault.columnPadding;
  const showScroll = !(suppressScroll || ColumnDefault.suppressScroll);

  let columnWidth = 0;
  let longAxisLabels = false;

  if (chartDataShape === 'multipleDimensions') {
    const multiDimWidth = width - margin.right - legendLeftPadding;

    columnWidth = multiDimWidth / (data.length + items.length);
    let noOfItems = 1;
    let paddingItem = -1;
    data.forEach((item, index) => {
      if (paddingItem === item.paddingShift) noOfItems++;
      paddingItem = item.paddingShift;
      item.x = columnWidth * noOfItems + index * columnWidth;
    });
  } else {
    const chartWidth = width - margin.right - legendLeftPadding;

    if (chartWidth - padding * data.length > 0) {
      columnWidth =
        (chartWidth - padding * data.length) / data.length / qMeasureCount;

      if (
        typeof columnPadding === 'undefined' &&
        columnWidth < ColumnDefault.zoomScrollOnColumnWidth
      ) {
        columnWidth =
          (chartWidth - ColumnDefault.columnPaddingNarrow * data.length) /
          data.length /
          qMeasureCount;

        padding = ColumnDefault.columnPaddingNarrow;
      }
    } else {
      if (
        chartWidth - (ColumnDefault.columnPaddingNarrow / 2) * data.length >
        0
      ) {
        columnWidth =
          (chartWidth - (ColumnDefault.columnPaddingNarrow / 2) * data.length) /
          data.length /
          qMeasureCount;

        padding = ColumnDefault.columnPaddingNarrow / 2;
      } else {
        columnWidth = (chartWidth - data.length) / data.length / qMeasureCount;
        padding = 1;
      }
    }
  }

  if (columnWidth > maxColumnWidth) columnWidth = maxColumnWidth;

  const isScrollDisplayed =
    showScroll && columnWidth < ColumnDefault.zoomScrollOnColumnWidth;

  switch (chartDataShape) {
    case 'singleDimension':
      xScaleSecondary
        .domain(rangeBands)
        .rangeRound([0, columnWidth * qMeasureCount]);

      xOverviewSecondary = d3
        .scaleBand()
        .domain(rangeBands)
        .rangeRound([0, columnWidth * 2]);

      break;
    case 'multipleDimensions':
      xAxis.tickValues(d3.range(0, items.length, 1));
      break;
  }

  function createYAxis(diagram, data) {
    let shiftForNegatives = 0;
    switch (chartDataShape) {
      case 'singleDimensionMeasure':
      case 'singleDimension':
      case 'stackedChart':
      case 'percentStacked':
        yScale.domain([qMin === 0 ? qMin : qMin, qMax]);
        shiftForNegatives =
          showLabels === 'top'
            ? ((labelTextHeightNegative +
                (labelOrientation === 'horizontal' ? 0 : 15) +
                yScale(qMax === 0 ? qMin : 0)) *
                1.03) /
              yScale(qMax === 0 ? qMin : 0)
            : 1.02;

        yScale.domain([qMin === 0 ? qMin : qMin * shiftForNegatives, qMax]);
        break;
      case 'multipleDimensions':
        yScale.domain([Math.min(0, qMin), Math.max(0, qMax)]);

        shiftForNegatives =
          showLabels === 'top'
            ? ((labelTextHeightNegative + yScale(0)) * 1.03) / yScale(0)
            : 1.02;

        yScale.domain([qMin === 0 ? qMin : qMin * shiftForNegatives, qMax]);
        break;
    }

    const yAxis = d3.axisLeft(yScale);

    if (chartDataShape === 'percentStacked') {
      // yAxis.ticks(yScale.ticks().length * 0.5, '%');
      switch (tickSpacing) {
        case 'wide':
          yAxis.ticks(yScale.ticks().length * 0.5, '%');
          break;
        case 'normal':
          yAxis.ticks(10, '%');
          break;
        case 'narrow':
          yAxis.ticks(yScale.ticks().length * 1.5, '%');
          break;
      }
    } else {
      switch (tickSpacing) {
        case 'wide':
          yAxis.ticks(yScale.ticks().length * 0.5);
          break;
        case 'normal':
          break;
        case 'narrow':
          yAxis.ticks(yScale.ticks().length * 1.5);
          break;
      }
    }

    const y = diagram
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(0,${titleHeights})`);

    y.call(yAxis);
    setStyle(y, yAxisStyle);

    if (['none', 'xAxis'].some((substring) => showAxis.includes(substring))) {
      diagram
        .select('.y.axis')
        .select('.domain')
        .remove();

      diagram
        .select('.y.axis')
        .selectAll('.tick')
        .selectAll('line')
        .remove();
    }

    const yValues = y.selectAll('g.tick');

    const numFormat = qMeasureInfo[0].qNumFormat;

    let decimals = 0;

    if (
      qMeasureInfo[0].qNumFormat.qType !== 'U' &&
      qMeasureInfo[0].qNumFormat.qFmt.includes('%')
    ) {
      decimals = `,.${
        numFormat.qFmt.slice(
          numFormat.qFmt.indexOf(numFormat.qDec) + 1,
          numFormat.qFmt.indexOf('%')
        ).length
      }%`;
    }

    yValues.each(function(i) {
      const self = d3.select(this);
      const textItem = self.select('text');

      const newValue =
        qMeasureInfo[0].qNumFormat.qType !== 'U' &&
        qMeasureInfo[0].qNumFormat.qFmt.includes('%')
          ? d3.format(decimals)(textItem.text())
          : formatValue(parseFloat(textItem.text().replace(/,/g, '')), true);

      textItem.text(
        ` ${newValue}${chartDataShape === 'percentStacked' ? '%' : ''}`
      );
    });
    // }

    if (['both', 'yAxis'].some((substring) => textOnAxis.includes(substring))) {
      // text label for the y axis
      const yAxisText = diagram
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr(
          'x',
          0 -
            (height -
              xAxisHeight +
              titleHeights -
              // xAxisTextHeight -
              legendHeight) /
              2
        )
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(qMeasureInfo.map((measure) => measure.qFallbackTitle).join(', '));

      setStyle(yAxisText, axisTitleStyle);
    }

    if (
      ['solid', 'dashes', 'dots', 'default'].some((substring) =>
        showGridlines.includes(substring)
      )
    ) {
      // Y Gridline
      const gridlines = d3
        .axisLeft()
        .tickFormat('')
        .tickSize(-(width - margin.right))
        .scale(yScale);

      switch (tickSpacing) {
        case 'wide':
          gridlines.ticks(yScale.ticks().length * 0.5);
          break;
        case 'normal':
          break;
        case 'narrow':
          gridlines.ticks(yScale.ticks().length * 1.5);
          break;
      }

      const y_gridlines = diagram
        .append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${titleHeights})`)
        .call(gridlines);

      const y_gridlines_lines = y_gridlines.selectAll('g.tick line');
      setStyle(y_gridlines_lines, GridLineStyle);

      switch (showGridlines) {
        case 'dashes':
          y_gridlines_lines.style('stroke-dasharray', '13, 13');
          break;
        case 'solid':
          x_gridlines_lines.style('stroke-dasharray', '0, 0');
          break;
        case 'dots':
          y_gridlines_lines.style('stroke-dasharray', '3,3');
          break;
        case 'default':
          setStyle(y_gridlines_lines, GridLineStyle);
          break;
      }

      y_gridlines.selectAll('.domain').remove();
    }
  }

  const getDimension = (dim) =>
    qDataSet.filter((d) => dim === d[Object.keys(d)[0]])[0];

  const setColumnColors = (diagram) => {
    switch (chartDataShape) {
      case 'singleDimensionMeasure':
        diagram.selectAll('[data-legend]').each(function() {
          const self = d3.select(this);
          let selected = false;
          self.style('fill', (d) => {
            selected = pendingSelections.includes(d.elemNumber);

            return color(d[Object.keys(d)[0]]);
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedColumn)
              : setStyle(self, NonSelectedColumn);
          }
        });
        break;
      case 'singleDimension':
        diagram.selectAll('[data-legend]').each(function(item, columnIndex) {
          const self = d3.select(this);
          let selected = false;
          const index = +self.attr('data-measure-index');

          self.style('fill', (d) => {
            selected = pendingSelections.includes(d.elemNumber);

            return color(
              conditionalColors.length === 0 ? rangeBands[index] : columnIndex //item[Object.keys(item)[0]]
            );
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedColumn)
              : setStyle(self, NonSelectedColumn);
          }
        });
        break;
      case 'stackedChart':
      case 'percentStacked':
        diagram.selectAll('[data-legend]').each(function() {
          const self = d3.select(this);
          let selected = false;
          self.style('fill', (d) => {
            const data = getDimension(d3.select(this).attr('data-parent'));
            selected = pendingSelections.includes(data.elemNumber);

            return color(d.key);
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedColumn)
              : setStyle(self, NonSelectedColumn);
          }
        });
        break;
      case 'multipleDimensions':
        diagram.selectAll('[data-legend]').each(function(item, i) {
          const self = d3.select(this);
          let selected = false;
          self.style('fill', (d) => {
            selected = pendingSelections.includes(d.elemNumber);
            return color(
              conditionalColors.length === 0 ? d[Object.keys(d)[2]] : i
            );
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedColumn)
              : setStyle(self, NonSelectedColumn);
          }
        });
        break;
    }
  };

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    let dim = d;

    // d3.select(this).attr('font-weight', 700); // Set as style in theme

    d = d3.select(this).attr('data-parent') || d;

    if (typeof d !== 'object') {
      dim = getDimension(d);
    }

    if (typeof d === 'number' && chartDataShape !== 'multipleDimensions') {
      dim = data[Object.keys(data)[d]];
    }
    if (typeof d === 'number' && chartDataShape === 'multipleDimensions') {
      const key = items[d];
      const item = data.filter((d) => d[Object.keys(d)[0]] === key);
      dim = item[Object.keys(data)[0]];
    }

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];
    const selectionValue = dim[Object.keys(dim)[1]];

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      pendingSelections = updateList;
    } else {
      pendingSelections = [...pendingSelections, selectionValue];
    }

    setColumnColors(diagram);

    beginSelections();

    setSelectionColumnVisible(true);

        if (!selections) return;
        let itemsSelected = null;
        if (selections.length !== 0) {
          itemsSelected = [
            ...new Set(
              selections.map((d, i) => {
                return d[Object.keys(d)[0]].qElemNumber;
              })
            ),
          ];

          if (pendingSelections.length !== 1) {
            select(0, [dim[Object.keys(dim)[1]]]);
          } else {
            select(
              0,
              itemsSelected.filter((e) => e !== dim[Object.keys(dim)[1]])
            );
          }
        } else {
          select(0, [dim[Object.keys(dim)[1]]]);
        }

    // buildSelections(pendingSelections);
  }

  const tooltipContainer = d3.select(d3Container.current);
  const tooltip = addTooltip({
    tooltipContainer,
    TooltipWrapper,
  });

  function handleMouseOver() {
    d3.select(this).style('cursor', 'pointer');
  }

  const formatValue = (val, precision, sign) => {
    let formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  let decimals = 0;
  const numFormat = qMeasureInfo[0].qNumFormat;

  if (
    qMeasureInfo[0].qNumFormat.qType !== 'U' &&
    qMeasureInfo[0].qNumFormat.qFmt.includes('%')
  ) {
    decimals = `,.${
      numFormat.qFmt.slice(
        numFormat.qFmt.indexOf(numFormat.qDec) + 1,
        numFormat.qFmt.indexOf('%')
      ).length
    }%`;
  }

  function handleMouseMove(d, i) {
    d3.select(this).style('cursor', 'pointer');

    // LR changing cursor location for cons
    //let cursorLocation = d3.mouse(this);
    const cursorLocation = [d3.event.layerX + 5, d3.event.layerY + 10];
    let data = {};
    let item = null;

    switch (chartDataShape) {
      case 'singleDimensionMeasure':
        data = {
          key: d[Object.keys(d)[0]],

          value:
            qMeasureInfo[0].qNumFormat.qType === 'U' ||
            qMeasureInfo[0].qNumFormat.qFmt === '##############' ||
            qMeasureInfo[0].qNumFormat.qFmt === '########' ||
            qMeasureInfo[0].qNumFormat.qFmt === '###0'
              ? formatValue(d[Object.keys(d)[2]])
              : qMatrix[i][qDimensionCount].qText,
        };
        break;
      case 'singleDimension':
        const measureNo = rangeBands.indexOf(
          d3.select(this).attr('data-legend')
        );

        const toolTipValue =
          qMeasureInfo[measureNo].qNumFormat.qType === 'U' ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === '##############' ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === '########' ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === '###0'
            ? formatValue(d3.select(this).attr('data-value'))
            : qMatrix[i][qDimensionCount + measureNo].qText;
        data = {
          key: d[Object.keys(d)[0]],
          value: `${d3.select(this).attr('data-legend')} : ${toolTipValue}`,
        };
        /*
        cursorLocation = [
          this.parentNode.transform.baseVal[0].matrix.e + d3.mouse(this)[0],
          d3.mouse(this)[1],
        ];
        */
        break;
      case 'stackedChart':
        data = {
          key: d.dimension,
          value: `${d.key} : ${formatValue(d.value)}`,
        };
        break;
      case 'percentStacked':
        data = {
          key: d.dimension,
          value: `${d.key}<br/>${d3.format('.0%')(d.value)}`,
        };
        break;
      case 'multipleDimensions':
        const key = d[Object.keys(d)[0]];

        const legendItem = d[Object.keys(d)[2]];

        const value =
          qMeasureInfo[0].qNumFormat.qType === 'U' ||
          qMeasureInfo[0].qNumFormat.qFmt === '##############' ||
          qMeasureInfo[0].qNumFormat.qFmt === '########' ||
          qMeasureInfo[0].qNumFormat.qFmt === '###0'
            ? formatValue(d3.select(this).attr('data-value'))
            : qMatrix[i][qDimensionCount].qText;

        data = {
          key,
          value: `${legendItem} : ${value}`,
        };
        break;
    }

    showTooltip({
      tooltip,
      cursorLocation,
      data,
      TooltipShowStyle,
    });
  }

  function handleMouseOut() {
    hideTooltip({ tooltip, TooltipHideStyle });
  }

  function setXAxisInteractivity() {
    diagram
      .selectAll('.x.axis .tick')
      .on('click', allowSelections ? handleClick : null)
      .on('mouseover', handleMouseOver);
  }

  const yScaelCalc = (d, index) =>
    qDimensionCount === 1
      ? yScale(d[Object.keys(d)[index]])
      : yScale(
          qMeasureInfo[0].qFallbackTitle.slice(0, 1) === '='
            ? d.value
            : d[qMeasureInfo[0].qFallbackTitle]
        );

  let xAxisTextHeight = 10;
  let xAxisText = 0;

  const drawColumns = (diagram, measureName, index) => {
    const columns = diagram
      .enter()
      .append('rect')
      .attr('data-legend', (d, i, j) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return rangeBands[i];
          case 'singleDimension':
            return measureName;
          case 'stackedChart':
          case 'percentStacked':
            return d.key;
          case 'multipleDimensions':
            return d[Object.keys(d)[2]];
        }
      })
      .attr('data-dimension', (d, i) => {
        if (chartDataShape === 'multipleDimensions') {
          return d[Object.keys(d)[0]];
        }
        return null;
      })
      .attr('data-value', (d) => d[Object.keys(d)[index]])
      .attr(
        'data-parent',
        chartDataShape === 'stackedChart' || chartDataShape === 'percentStacked'
          ? (d) => d.dimension
          : null
      )
      .attr(
        'data-measure-index',
        chartDataShape === 'singleDimension'
          ? index - qDimensionCount - 1
          : null
      )
      .on('click', allowSelections ? handleClick : null)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut)
      .attr('x', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return xScale(i) + padding;
          case 'stackedChart':
          case 'percentStacked':
            return xScale(d.dimIndex) + padding;
          case 'singleDimension':
            return xScaleSecondary(measureName) + padding;
          case 'multipleDimensions':
            return d.x;
        }
      })
      .attr('width', columnWidth)
      .attr(
        'y',
        height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight
      )
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)
      .attr('y', (d) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
          case 'singleDimension':
          case 'multipleDimensions':
            //  .attr("y", d => (d.value<0 ? y(0) : y(d.value)) )
            // return yScaelCalc(d, index);
            return qDimensionCount === 1
              ? yScale(Math.max(d[Object.keys(d)[index]], 0))
              : yScale(
                  Math.max(
                    qMeasureInfo[0].qFallbackTitle.slice(0, 1) === '='
                      ? d.value
                      : d[qMeasureInfo[0].qFallbackTitle],
                    0
                  )
                );
          case 'stackedChart':
          case 'percentStacked':
            return yScale(d[1]);
        }
      })
      .attr('height', (d) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
          case 'singleDimension':
          case 'multipleDimensions':
            return Math.abs(yScaelCalc(d, index) - yScale(0));
          case 'stackedChart':
          case 'percentStacked':
            return yScale(d[0]) - yScale(d[1]);
        }
      });

    setStyle(columns, ColumnStyle);
  };

  const drawColumnLabels = (columnLabels, measureName, index) => {
    const labelShift =
      showLabels === 'top'
        ? [-5, labelTextHeightNegative]
        : [labelTextHeight, -labelTextHeightNegative / 2];

    const labels = columnLabels
      .enter()
      .append('text')
      .attr(
        'transform',
        labelOrientation === 'vertical' ? 'translate(-5,0) rotate(-90)' : null
      )

      .attr('text-anchor', (d) => {
        let labelPosition = null;

        if (
          chartDataShape === 'stackedChart' ||
          chartDataShape === 'percentStacked'
        ) {
          if (labelOrientation === 'horizontal') {
            labelPosition = 'middle';
          } else {
            labelPosition = 'top';
          }
        } else if (labelOrientation === 'horizontal') {
          labelPosition = 'middle';
        } else if (showLabels === 'top') {
          if (d[Object.keys(d)[index]] < 0) {
            labelPosition = 'end';
          } else {
            labelPosition = 'top';
          }
        } else {
          // negative values
          if (d[Object.keys(d)[index]] < 0) {
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelTextHeightNegative
            ) {
              labelPosition = 'top';
            } else {
              labelPosition = 'end';
            }
          } else {
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelTextHeight
            ) {
              labelPosition = 'end';
            } else {
              labelPosition = 'top';
            }
          }
        }
        return labelPosition;
      })
      .attr('x', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            if (labelOrientation === 'horizontal') {
              return xScale(i) + padding + columnWidth / 2;
            } else {
              return -(
                height -
                titleHeights -
                xAxisHeight -
                xAxisTextHeight -
                legendHeight
              );
            }

          case 'singleDimension':
            if (labelOrientation === 'horizontal') {
              return xScaleSecondary(measureName) + columnWidth / 2 + +padding;
            }

            return -(
              height -
              titleHeights -
              xAxisHeight -
              xAxisTextHeight -
              legendHeight
            );

          case 'multipleDimensions':
            if (labelOrientation === 'horizontal') {
              return d.x + columnWidth / 2;
            }

            return -(
              height -
              titleHeights -
              xAxisHeight -
              xAxisTextHeight -
              legendHeight
            );
          case 'stackedChart':
            if (labelOrientation === 'horizontal') {
              return xScale(d.dimIndex) + padding + columnWidth / 2;
            } else {
              return -(
                height -
                titleHeights -
                xAxisHeight -
                xAxisTextHeight -
                legendHeight
              );
            }
        }
      })
      .attr('y', (d, i) => {
        if (labelOrientation === 'horizontal') {
          return (
            height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight
          );
        } else {
          switch (chartDataShape) {
            case 'singleDimensionMeasure':
              return xScale(i) + padding + columnWidth / 2 + labelTextWidth / 2;
            case 'singleDimension':
              return (index % qMeasureCount) * columnWidth;
            case 'multipleDimensions':
              return d.x + columnWidth;
            case 'stackedChart':
              return (
                xScale(d.dimIndex) +
                padding +
                columnWidth / 2 +
                labelTextWidth / 2
              );
          }
        }
      })
      .attr('height', 0)
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)

      .text((d, i) => {
        if (
          chartDataShape === 'stackedChart' ||
          chartDataShape === 'percentStacked'
        ) {
          return formatValue(d.total);
        } else {
          return qMeasureInfo[index - measureStartPosition].qNumFormat.qType ===
            'U' ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              '##############' ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              '########' ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              '###0'
            ? formatValue(d[Object.keys(d)[index]])
            : qMatrix[i][index - measureStartPosition + qDimensionCount].qText;
        }
      });

    if (labelOrientation === 'horizontal') {
      labels.attr('y', (d) => {
        let yValue = null;
        if (chartDataShape === 'stackedChart') {
          return `${yScale(d.total) - 5}`;
        } else {
          if (d[Object.keys(d)[index]] <= 0) {
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelShift[0]
            ) {
              yValue = `${yScale(d[Object.keys(d)[index]]) + labelShift[1]}`;
            } else {
              // if showLables = "inside" and label larger than bar, move lable outside of bar
              yValue = `${yScale(d[Object.keys(d)[index]]) +
                labelTextHeightNegative}`;
            }
          } else {
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelShift[0]
            ) {
              yValue = `${yScale(d[Object.keys(d)[index]]) + labelShift[0]}`;
            } else {
              // if showLables = "inside" and label larger than bar, move lable outside of bar
              yValue = `${yScale(d[Object.keys(d)[index]]) - 5}`;
            }
          }
          return yValue;
        }
      });
    } else {
      const item = labels.attr('x', (d) => {
        let xValue = null;
        if (chartDataShape === 'stackedChart') {
          // return `-${yScale(d.total) - 5}`;
          return -`${yScale(d.total) - 5}`;
        } else if (showLabels === 'top') {
          if (d[Object.keys(d)[index]] < 0) {
            return -`${yScale(d[Object.keys(d)[index]]) - labelShift[0]}`;
          } else {
            return -`${yScale(d[Object.keys(d)[index]]) + labelShift[0]}`;
          }
        } else {
          // negative values
          if (d[Object.keys(d)[index]] < 0) {
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelTextHeightNegative
            ) {
              xValue = -`${yScale(d[Object.keys(d)[index]]) - labelShift[0]}`;
            } else {
              // if showLables = "inside" and label larger than bar, move lable outside of bar
              xValue = -`${yScale(d[Object.keys(d)[index]]) + 5}`;
            }
          } else {
            // positive values
            if (
              Math.abs(yScale(d[Object.keys(d)[index]]) - yScale(0)) >
              labelTextHeight
            ) {
              xValue = -`${yScale(d[Object.keys(d)[index]]) + 5}`;
            } else {
              // if showLables = "inside" and label larger than bar, move lable outside of bar
              xValue = -`${yScale(d[Object.keys(d)[index]]) - 5}`;
            }
          }
          return xValue;
        }
      });
    }

    setStyle(labels, ColumnLabelStyle);
  };

  const diagram = svg
    .append('g')
    .attr('class', 'focus')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let titleHeight = 0;
  if (title) {
    titleHeight = addTitle({
      svg,
      title,
      TitleStyle,
    });
  }
  let subTitleHeight = titleHeight;
  if (subTitle) {
    subTitleHeight = addSubTitle({
      svg,
      subTitle,
      SubTitleStyle,
    });
  }

  let yOverview = null;
  let yScale = null;
  let titleHeights = 0;
  let labelOrientation = 'horizontal';

  const xAxisDiag = diagram.append('g').attr('class', 'x axis');

  setStyle(xAxisDiag, xAxisStyle);

  let labelTextWidth = 0;
  let labelTextHeightNegative = 0;
  let labelTextHeight = 0;

  function setHeight(xAxisHeight = 0) {
    if (isScrollDisplayed) {
      height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
      heightOverview =
        +parseInt(heightValue, 10) - marginOverview.top - marginOverview.bottom;
    } else {
      margin.bottom = marginOverview.bottom;
      height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
    }

    svg.attr('height', height + margin.top + margin.bottom);

    yOverview = d3
      .scaleLinear()
      .range([heightOverview, 0])
      .domain([qMin, qMax]);

    // let labelTextHeight = 0;

    if (showLabels !== 'none') {
      const numFormat = qMeasureInfo[0].qNumFormat;
      let decimals = 0;

      if (
        qMeasureInfo[0].qNumFormat.qType !== 'U' &&
        qMeasureInfo[0].qNumFormat.qFmt.includes('%')
      ) {
        decimals = `,.${
          numFormat.qFmt.slice(
            numFormat.qFmt.indexOf(numFormat.qDec) + 1,
            numFormat.qFmt.indexOf('%')
          ).length
        }%`;
      }

      const textValue =
        qMeasureInfo[0].qNumFormat.qType === 'U' ||
        qMeasureInfo[0].qNumFormat.qFmt === '##############' ||
        qMeasureInfo[0].qNumFormat.qFmt === '########' ||
        qMeasureInfo[0].qNumFormat.qFmt === '###0' ||
        chartDataShape === 'stackedChart' ||
        chartDataShape === 'percentStacked'
          ? formatValue(qMax)
          : d3.format(decimals)(qMax);

      const sampleText = svg
        .selectAll('.sampleText')
        .data([textValue])
        .enter()
        .append('text')
        .text((d) => d);

      labelTextHeight =
        columnWidth >= sampleText.node().getBBox().width
          ? sampleText.node().getBBox().height
          : sampleText.node().getBBox().width;

      labelTextHeight =
        showLabels === 'inside' ? labelTextHeight + 2 : labelTextHeight;

      if (columnWidth < sampleText.node().getBBox().width) {
        labelOrientation = 'vertical';
        labelTextWidth = sampleText.node().getBBox().height;
      }

      if (
        // chartDataShape === 'stackedChart' ||
        chartDataShape === 'percentStacked'
      ) {
        labelTextHeight = 0;
        labelTextWidth = 0;
      }

      sampleText.remove();

      if (qMin < 0) {
        const textValue =
          qMeasureInfo[0].qNumFormat.qType === 'U' ||
          qMeasureInfo[0].qNumFormat.qFmt === '##############' ||
          qMeasureInfo[0].qNumFormat.qFmt === '########' ||
          qMeasureInfo[0].qNumFormat.qFmt === '###0' ||
          chartDataShape === 'stackedChart' ||
          chartDataShape === 'percentStacked'
            ? formatValue(qMin)
            : d3.format(decimals)(qMin);

        const sampleText = svg
          .selectAll('.sampleText')
          .data([textValue])
          .enter()
          .append('text')
          .text((d) => d);

        labelTextHeightNegative = sampleText.node().getBBox().width;

        labelTextHeightNegative =
          columnWidth >= sampleText.node().getBBox().width
            ? sampleText.node().getBBox().height
            : sampleText.node().getBBox().width;

        sampleText.remove();
      }
    }

    titleHeights =
      titleHeight + subTitleHeight + labelTextHeight ||
      `${parseInt(labelTextHeight + margin.top)}`;

    // Reduce top margin if Titles take up much space.
    titleHeights =
      titleHeights /
        (height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight) >
      1
        ? (titleHeights -= margin.top / 2)
        : titleHeights;

    // titleHeights = titleHeights > 0 ? titleHeights - margin.top : titleHeights;

    yScale = d3
      .scaleLinear()
      .range([
        height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight,
        0,
      ]);
  }

  xAxisDiag.call(xAxis);

  if (['none', 'yAxis'].some((substring) => showAxis.includes(substring))) {
    diagram
      .select('.x.axis')
      .select('.domain')
      .remove();
  }

  diagram
    .select('.x.axis')
    .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
    .selectAll('.tick text')
    .text((d, i) => {
      const item = Object.entries(data[i]).filter(
        (d) => d[0] === qDimensionInfo[0].qFallbackTitle
      );

      return item[0][1];
    });

  // Adjust X axis location
  diagram
    .select('.x.axis')
    .selectAll('.tick')
    .attr('transform', (d, i) => {
      switch (chartDataShape) {
        case 'singleDimensionMeasure':
        case 'stackedChart':
        case 'percentStacked':
          return `translate(${xScale(i) + padding + columnWidth / 2},0)`;

        case 'singleDimension':
          return `translate(${xScale(i) +
            (columnWidth / 2) * qMeasureCount +
            padding},0)`;
      }
    });
  // }

  function shiftXAxis() {
    if (chartDataShape === 'multipleDimensions') {
      const ticks = diagram.select('.x.axis').selectAll('g.tick');
      ticks.each(function(i) {
        const self = d3.select(this);
        self.select('text').text(items[i]);
        const rects = diagram.selectAll(`rect[data-dimension="${items[i]}"]`);

        const start = rects._groups[0][0].x.baseVal.value;
        const end =
          rects._groups[0][rects._groups[0].length - 1].x.baseVal.value +
          rects._groups[0][rects._groups[0].length - 1].width.baseVal.value;
        const transformValue = start + (end - start) / 2;
        self.attr(
          'transform',
          (d, index) => `translate(${transformValue}${padding},0)`
        );
      });
    }
  }

  const xAxisLableSize = getXAxisLabelSize();
  xAxisLabels();
  createColumns(diagram, data);
  if (showLabels !== 'none') createLabels(); // Value Labels for Chart Columns

  if (
    ['both', 'xAxis'].some((substring) => showAxis.includes(substring)) &&
    qMin < 0
  ) {
    diagram
      .append('line')
      .attr('transform', `translate(0,${titleHeights})`)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('x1', 0)
      .attr('x2', xScale.range()[1])
      .attr('stroke', 'black');

    diagram
      .select('.x.axis')
      .select('.domain')
      .remove();
  }

  shiftXAxis();
  setXAxisInteractivity(diagram);

  function drawMiniChart(subColumns, measureName, index) {
    const cols = subColumns
      .enter()
      .append('rect')
      .attr('height', (d) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
          case 'singleDimension':
          case 'multipleDimensions':
            return Math.abs(yOverview(d[Object.keys(d)[index]]) - yOverview(0));
          case 'stackedChart':
          case 'percentStacked':
            return yOverview(d[0]) - yOverview(d[1]);
        }
      })
      .attr('width', columnWidth)
      .attr('x', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return xOverview(i) + padding;
          case 'stackedChart':
          case 'percentStacked':
            return xOverview(d.dimIndex) + padding;
          case 'singleDimension':
            return xOverviewSecondary(measureName) + padding;
          case 'multipleDimensions':
            return d.x;
        }
      })
      .attr('y', (d) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
          case 'singleDimension':
          case 'multipleDimensions':
            // return yOverview(d[Object.keys(d)[index]]) - legendHeight;
            return qDimensionCount === 1
              ? yOverview(Math.max(d[Object.keys(d)[index]], 0))
              : yOverview(
                  Math.max(
                    qMeasureInfo[0].qFallbackTitle.slice(0, 1) === '='
                      ? d.value
                      : d[qMeasureInfo[0].qFallbackTitle],
                    0
                  )
                );
          case 'stackedChart':
          case 'percentStacked':
            return yOverview(d[1]) - legendHeight;
          // return yOverview(d[Object.keys(d)[index]]) - legendHeight;
        }
      })
      .attr('fill', (d, index) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return color(rangeBands[index]);
          case 'singleDimension':
            return color(measureName);
          case 'stackedChart':
          case 'percentStacked':
            return color(d.key);
          case 'multipleDimensions':
            return color(d.band.split('|')[1]);
        }
      })
      .attr('data-legend', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return rangeBands[i];
          case 'singleDimension':
            return measureName;
          case 'stackedChart':
          case 'percentStacked':
            return d.key;
          case 'multipleDimensions':
            return d.band.split('|')[1];
        }
      });
    setStyle(cols, ColumnOverviewColumn);
  }

  let xAxisHeight = 0;

  function getXAxisLabelSize() {
    let colWidth = columnWidth;

    if (chartDataShape === 'multipleDimensions') {
      colWidth *= categories.length;
    }

    const newItem = svg.append('g');

    let longest = '';
    let longestLength = 0;

    const container = newItem
      .append('text')
      .attr('y', 0)
      .attr('dy', 0)
      .text(longest);

    data.map((d) => {
      container.text(d[Object.keys(d)[0]]);

      if (newItem.node().getBBox().width > longestLength) {
        longest = d[Object.keys(d)[0]];
        longestLength = newItem.node().getBBox().width;
      }
    });

    container.text(longest);

    if (colWidth * qMeasureCount >= newItem.node().getBBox().width) {
      const size = newItem.node().getBBox();
      newItem.remove();

      return size;
    }

    longAxisLabels = true;
    do {
      longest = longest.substring(0, longest.length - 1);

      container.text(longest + '...');
    } while (newItem.node().getBBox().width > maxAxisLength);

    container.attr('transform', 'translate(0,2) rotate(-45)');

    xAxisOrientation = 'Rotated';

    const size = newItem.node().getBBox();

    newItem.remove();

    return size;
  }

  function xAxisLabels() {
    // If labels are longer than bandwidth rotate them
    if (xAxisOrientation === 'Rotated') {
      const xAxisLabels = diagram
        .select('.x.axis')
        .selectAll('text')
        .attr('dy', '.35em')
        .attr('transform', 'translate(0,2) rotate(-45)')
        .style('text-anchor', 'end');

      const shiftLabels = columnWidth / 4;

      diagram
        .select('.x.axis')
        .selectAll('g.tick')
        .attr('transform', function(d, i) {
          return typeof this.transform.baseVal[0] !== 'undefined'
            ? `translate(${this.transform.baseVal[0].matrix.e - shiftLabels},0)`
            : null;
        });

      if (longAxisLabels) {
        xAxisLabels.each(function(i) {
          const self = d3.select(this);

          if (self.node().getBBox().width > maxAxisLength) {
            let axisText = self.text();
            do {
              axisText = axisText.substring(0, axisText.length - 1);
              self.text(axisText + '...');
            } while (self.node().getBBox().width > maxAxisLength);
          }
        });
      }
    }

    xAxisHeight =
      xAxisLableSize.height - (isScrollDisplayed ? marginOverview.bottom : 0);

    if (['both', 'xAxis'].some((substring) => textOnAxis.includes(substring))) {
      // text label for the x axis
      xAxisText = diagram
        .append('text')
        .style('text-anchor', 'middle')
        .text(qDimensionInfo[0].qFallbackTitle);

      setStyle(xAxisText, axisTitleStyle);

      xAxisTextHeight =
        xAxisText.node().getBBox().height + (isScrollDisplayed ? 10 : 0);
    }

    setHeight(xAxisHeight);

    if (['both', 'xAxis'].some((substring) => textOnAxis.includes(substring))) {
      xAxisText.attr(
        'transform',
        `translate(${width / 2} ,${height +
          margin.top -
          legendHeight +
          (isScrollDisplayed ? 5 : 0)})
          `
      );
    }

    xAxisDiag.attr(
      'transform',
      `translate(0,${height - xAxisHeight - xAxisTextHeight - legendHeight})`
    );
  }

  const brush = d3
    .brushX()
    .extent([
      [0, -legendHeight],
      // [width - margin.right - legendLeftPadding, heightOverview - legendHeight],
      [width - margin.right - legendLeftPadding, heightOverview - legendHeight],
    ])
    .on('brush', brushed);

  function setupMiniChart() {
    if (
      chartDataShape === 'stackedChart' ||
      chartDataShape === 'percentStacked'
    ) {
      const layers = d3
        .stack()
        .keys(rangeBands)
        .offset(d3.stackOffsetDiverging)(data);

      data = [];

      layers.forEach((v, idx) => {
        const y = [];
        const x = v.filter((s) => !isNaN(s[1]));
        y.key = v.key;
        y.index = v.index;
        x.forEach((z) => {
          const data = [];
          data[0] = z[0];
          data[1] = z[1];
          data['dimension'] = z.data[Object.keys(z.data)[0]];
          data['elemNumber'] = z.data.elemNumber;
          data['value'] = z.data[v.key];
          data['dimIndex'] = z.data.dimIndex;
          y.push(data);
        });
        if (y.length !== 0) {
          data.push(y);
        }
      });
    }

    const context = svg
      .append('g')
      .attr('class', 'context')
      .attr(
        'transform',
        `translate(${marginOverview.left},${marginOverview.top})`
      );

    let category_g2 = null;

    switch (chartDataShape) {
      case 'singleDimensionMeasure':
        drawMiniChart(
          context.selectAll('.subColumn').data(data),
          rangeBands[0],
          measureStartPosition
        );
        break;
      case 'singleDimension':
        category_g2 = context
          .append('g')
          .classed('columns', true)
          .selectAll('.category')
          .data(data, (d) => d[Object.keys(d)[0]])
          .enter()
          .append('g')
          .attr('class', (d) => `extent category-${d[Object.keys(d)[0]]}`)
          // .attr('transform', (d, i) => `translate(${xOverview(i)},0)`);
          .attr(
            'transform',
            (d, i) => `translate(${xOverview(i)},${-legendHeight})`
          );

        qMeasureInfo.forEach((measure, index) => {
          const rects = category_g2.selectAll('category-rect').data((d) => [d]);

          drawMiniChart(rects, rangeBands[index], measureStartPosition + index);
        });
        break;
      case 'stackedChart':
      case 'percentStacked':
        const rects = context.selectAll('rect').data(data);

        var rect = rects
          .enter()
          .selectAll('rect')
          .data((d) => {
            d.forEach((d1) => {
              d1.key = d.key;

              return d1;
            });

            return d;
          });

        drawMiniChart(rect, rangeBands[0], measureStartPosition);

        break;
      case 'multipleDimensions':
        drawMiniChart(
          context.selectAll('.subColumn').data(data),
          rangeBands[0],
          measureStartPosition
        );
        break;
    }

    context
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        'translate(0,' + `${heightOverview - legendHeight}` + ')'
      )
      .call(xAxisOverview);

    let scrollColumnRatio = 1;
    if (columnWidth < ColumnDefault.zoomScrollOnColumnWidth) {
      // scrollColumnRatio =
      //   (chartDataShape === 'multipleDimensions'
      //     ? xScale.range()[1] / (data.length + items.length)
      //     : columnWidth) / ColumnDefault.zoomScrollOnColumnWidth;

      padding = ColumnDefault.columnPaddingNarrow;
      let scrollItem = null;
      let i = 1;

      while (i <= xScale.range()[1]) {
        scrollItem = i;
        if (
          (xScale(1) / i) * xScale.range()[1] <=
          ColumnDefault.zoomScrollOnColumnWidth +
            ColumnDefault.columnPaddingNarrow
        ) {
          break;
        }

        i++;
      }

      scrollColumnRatio = scrollItem / xScale.range()[1];
    }

    context
      .append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, [
        xScale.range()[0],
        Math.ceil(xScale.range()[1] * scrollColumnRatio),
        // Math.ceil(xScale.range()[1] * 0.15),
        // Math.ceil(xScale.range()[1]),
      ]);

    if (allowZoom || ColumnDefault.allowZoom) {
    } else {
      // removes handle to resize the brush
      context.selectAll('.brush>.handle').remove();
      // removes crosshair cursor
      context.selectAll('.brush>.overlay').remove();
    }
  }

  if (isScrollDisplayed) setupMiniChart();

  // Group Setup for Value Labels for Chart Columns
  function createLabels() {
    let columnLabels = null;
    let multiLabels = null;

    switch (chartDataShape) {
      case 'singleDimensionMeasure':
        columnLabels = diagram
          .append('g')
          .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
          .attr('class', 'column-labels')
          .attr('transform', `translate(0,${titleHeights})`)
          .selectAll('[data-measure-label]')
          .data(data, (d) => d[Object.keys(d)[0]]);

        drawColumnLabels(columnLabels, rangeBands[0], measureStartPosition);
        break;
      case 'singleDimension':
        const initialTransform =
          labelOrientation === 'horizontal'
            ? 0
            : columnWidth +
              labelTextWidth +
              Math.ceil(labelTextWidth - columnWidth);

        multiLabels = diagram
          .append('g')
          .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
          .attr('class', 'column-labels')
          .attr('transform', `translate(0,${titleHeights})`)
          .selectAll('.model_name_labels')
          .data(data, (d) => d[Object.keys(d)[0]])
          .enter()
          .append('g')
          .attr(
            'transform',
            (d, i) => `translate(${xScale(i) + initialTransform},${0})`
          );

        qMeasureInfo.forEach((measure, index) => {
          columnLabels = multiLabels
            .selectAll(`text${rangeBands[index]}`)
            .data((d) => [d]);
          drawColumnLabels(
            columnLabels,
            rangeBands[index],
            measureStartPosition + index
          );
        });
        break;
      case 'multipleDimensions':
        columnLabels = diagram
          .append('g')
          .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
          .attr('class', 'column-labels')
          .attr('transform', `translate(0,${titleHeights})`)
          .selectAll('[data-measure-label]')
          .data(data, (d) => d[Object.keys(d)[0]]);

        drawColumnLabels(columnLabels, rangeBands[0], measureStartPosition);
        break;
      case 'stackedChart':
        columnLabels = diagram
          .append('g')
          .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
          .attr('class', 'column-labels')
          .attr('transform', `translate(0,${titleHeights})`)
          .selectAll('[data-measure-label]')
          // .data(data, (d) => d[Object.keys(d)[0]]);
          .data(data);

        drawColumnLabels(columnLabels, rangeBands[0], measureStartPosition);
        break;
    }
  }

  function createColumns(diagram, data) {
    createYAxis(diagram, data);

    if (
      chartDataShape === 'stackedChart' ||
      chartDataShape === 'percentStacked'
    ) {
      const layers = d3
        .stack()
        .keys(rangeBands)
        .offset(d3.stackOffsetDiverging)(data);

      data = [];

      layers.forEach((v, idx) => {
        const y = [];
        const x = v.filter((s) => !isNaN(s[1]));
        y.key = v.key;
        y.index = v.index;
        x.forEach((z) => {
          const data = [];
          data[0] = z[0];
          data[1] = z[1];
          data['dimension'] = z.data[Object.keys(z.data)[0]];
          data['elemNumber'] = z.data.elemNumber;
          data['value'] = z.data[v.key];
          data['dimIndex'] = z.data.dimIndex;
          y.push(data);
        });
        if (y.length !== 0) {
          data.push(y);
        }
      });
    }

    const rects = diagram
      .append('g')
      .attr('clip-path', isScrollDisplayed ? `url(#${uuid})` : null)
      .classed('columns', true)
      .attr('transform', `translate(0,${titleHeights})`)
      .selectAll('rect')
      .data(data, (d) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
          case 'singleDimension':
            return d[Object.keys(d)[0]];
          case 'stackedChart':
          case 'percentStacked':
          case 'multipleDimensions':
            return data;
        }
      });

    let columns = null;
    switch (chartDataShape) {
      case 'singleDimensionMeasure':
        drawColumns(rects, rangeBands[0], measureStartPosition);
        break;
      case 'singleDimension':
        columns = rects
          .enter()
          .append('g')
          .attr('transform', (d, i) => `translate(${xScale(i)},0)`);

        qMeasureInfo.forEach((measure, index) => {
          const series = columns.selectAll(`rect${index}`).data((d) => [d]);

          drawColumns(series, rangeBands[index], measureStartPosition + index);
        });
        break;
      case 'stackedChart':
      case 'percentStacked':
        var rect = rects
          .enter()
          .append('g')
          .selectAll('rect')
          .data((d) => {
            d.forEach((d1) => {
              d1.key = d.key;

              return d1;
            });

            return d;
          });
        drawColumns(rect, rangeBands[0], measureStartPosition);

        break;
      case 'multipleDimensions':
        drawColumns(rects, rangeBands[0], measureStartPosition);
        break;
    }

    setColumnColors(diagram);
  }
  if (isScrollDisplayed) {
    svg
      .append('defs')
      .append('clipPath')
      .attr('transform', `translate(0,-${titleHeights})`)
      .attr('id', uuid)
      .append('rect')
      .attr('y', -margin.top - xAxisHeight)
      .attr('width', width - margin.right - legendLeftPadding)
      .attr('height', heightValue);
  }

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
    const s = d3.event.selection || xOverview.range();

    xScale.domain(s.map(xOverview.invert, xOverview));

    const columnRatio =
      (width - margin.right - legendLeftPadding) / (s[1] - s[0]);

    if (chartDataShape === 'multipleDimensions') {
      const multiDimWidth =
        (width - margin.right - legendLeftPadding) * columnRatio;
      columnWidth = multiDimWidth / (data.length + items.length);
      let noOfItems = 1;
      let paddingItem = -1;
      data.forEach((item, index) => {
        if (paddingItem === item.paddingShift) noOfItems++;
        paddingItem = item.paddingShift;
        item.x =
          columnWidth * noOfItems +
          index * columnWidth -
          (xScale.domain()[0] / xScale.domain()[1]) *
            xScale.range()[1] *
            columnRatio;
      });
    } else {
      columnWidth = ColumnDefault.zoomScrollOnColumnWidth;
    }

    xAxisHeight =
      xAxisLableSize.height - (isScrollDisplayed ? marginOverview.bottom : 0);

    const rects = diagram.selectAll('rect');

    rects
      .attr('x', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return xScale(i) + padding;
          case 'singleDimension':
            rects._groups[0][
              i
            ].parentNode.transform.baseVal[0].matrix.e = xScale(
              parseInt(i / qMeasureCount)
            );

            return columnWidth * (i % qMeasureCount) + padding;
          case 'stackedChart':
          case 'percentStacked':
            return xScale(d.dimIndex) + padding;
          case 'multipleDimensions':
            return d.x;
        }
      })
      .attr('width', columnWidth);

    // const labels = diagram.selectAll('[data-measure-label]');
    const labels = diagram.select('.column-labels').selectAll('text');

    if (labelOrientation === 'horizontal') {
      labels.attr('x', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return xScale(i) + padding + columnWidth / 2;
          case 'singleDimension':
            labels._groups[0][
              i
            ].parentNode.transform.baseVal[0].matrix.e = xScale(
              parseInt(i / qMeasureCount)
            );

            return (
              columnWidth * (i % qMeasureCount) +
              columnWidth / qMeasureCount +
              padding
            );
          case 'multipleDimensions':
            return d.x + columnWidth / 2;
          case 'stackedChart':
            return xScale(d.dimIndex) + padding + columnWidth / 2;
        }
      });
    } else {
      labels.attr('y', (d, i) => {
        switch (chartDataShape) {
          case 'singleDimensionMeasure':
            return xScale(i) + padding + columnWidth / 2 + labelTextWidth / 2;
          case 'singleDimension':
            labels._groups[0][
              i
            ].parentNode.transform.baseVal[0].matrix.e = xScale(
              parseInt(i / qMeasureCount)
            );

            return (
              padding +
              columnWidth / 2 +
              labelTextWidth / 2 +
              (i % qMeasureCount) * columnWidth
            );
          case 'multipleDimensions':
            return d.x + columnWidth / 2 + labelTextWidth / 2;
          case 'stackedChart':
            return (
              xScale(d.dimIndex) +
              padding +
              columnWidth / 2 +
              labelTextWidth / 2
            );
        }
      });
    }

    diagram
      .select('.x.axis')
      .selectAll('.tick')
      .attr(
        'transform',
        (d, i) =>
          `translate(${xScale(i) +
            (columnWidth / 2) * qMeasureCount +
            padding},0)`
      );

    shiftXAxis();
  }
}
