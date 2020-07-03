import * as d3 from "d3";
import { hyperCubeTransform } from "../../../utils";

import scaleRadial from "./d3-scale-radial";

import {
  addTitle,
  addSubTitle,
  addLegend,
  addTooltip,
  showTooltip,
  hideTooltip,
} from "../../D3";

import { setStyle } from "../../D3/Helpers";
import { roundNumber, colorByExpression } from "../../../utils";

export default function CreateBarPlot({
  qLayout,
  qData,
  // chartWidth,
  chartHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionBarPlotVisible,
  // buildSelections,
  selections,
  select,
  title,
  subTitle,
  showLegend,
  allowSelections,
  BarPlotThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  innerRadius,
  outerRadius,
  padAngle,
} = chartSettings) {
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
    BarPlotChartStyle,
    BarPlotLabelStyle,
    SelectedBarPlot,
    NonSelectedBarPlot,
    colorPalette,
  } = BarPlotThemes;

  const { qMatrix } = qData;

  const qDataSet = hyperCubeTransform(qData, qLayout.qHyperCube);

  const qMesaures = qLayout.qHyperCube.qMeasureInfo;

  const qMax = Math.max(...qMesaures.map((d) => d.qMax));

  // Check if width is % or number in px
  // const widthValue = /^\d+(\.\d+)?%$/.test(chartWidth)
  //   ? (+parseInt(chartWidth, 10) / 100) * screenWidth
  //   : +parseInt(chartWidth, 10);

  // Check if height is % or number in px
  let heightValue = /^\d+(\.\d+)?%$/.test(chartHeight)
    ? (+parseInt(chartHeight, 10) / 100) * window.innerHeight
    : +parseInt(chartHeight, 10);

  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 50,
  };

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(
    qLayout.qHyperCube,
    qMatrix,
    colorPalette
  );

  const color = d3.scaleOrdinal(
    conditionalColors.length !== 0 ? conditionalColors : colorPalette
  );

  const tooltipContainer = d3.select(d3Container.current);
  const tooltip = addTooltip({
    tooltipContainer,
    TooltipWrapper,
  });

  let pendingSelections = [];

  const formatValue = (val, precision, sign) => {
    let formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  function handleMouseMove(d, i) {
    d3.select(this).style("cursor", "pointer");

    const cursorLocation = [d3.event.layerX, d3.event.layerY];

    const data = {
      key: d[Object.keys(d)[0]],
      value: formatValue(d[Object.keys(d)[2]]),
    };

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

  const setBarPlotColors = () => {
    svg.selectAll("path").each(function() {
      const self = d3.select(this);
      const selected = pendingSelections.includes(
        parseInt(this.getAttribute("elemNumber"))
      );
      if (useSelectionColours) {
        selected
          ? setStyle(self, SelectedBarPlot)
          : setStyle(self, NonSelectedBarPlot);
      }
    });
  };

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    const selectionValue = d.elemNumber;

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      pendingSelections = updateList;
    } else {
      pendingSelections = [...pendingSelections, selectionValue];
    }

    setBarPlotColors();

    beginSelections();

    setSelectionBarPlotVisible(true);

    //  if (!selections) return;
    //  let itemsSelected = null;
    //  if (selections.length !== 0) {
    //    itemsSelected = [
    //      ...new Set(
    //        selections.map((d, i) => {
    //          return d[Object.keys(d)[0]].qElemNumber;
    //        })
    //      ),
    //    ];

    //    if (pendingSelections.length !== 1) {
    //      select(0, [selectionValue]);
    //    } else {
    //      select(
    //        0,
    //        itemsSelected.filter(
    //          (e) => e !== selectionValue
    //        )
    //      );
    //    }
    //  } else {
    //    select(0, [selectionValue]);
    //  }

    // buildSelections(pendingSelections);

    select(0, pendingSelections);
  }

  d3.select(d3Container.current)
    .select("svg")
    .remove();

  const svg = d3
    .select(d3Container.current)
    .append("svg")
    .attr("width", screenWidth)
    .attr("height", heightValue);

  setStyle(svg, BarPlotChartStyle);

  const diagram = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const dataKeys = qDataSet.map((d) => d[Object.keys(d)[0]]);

  const { legendWidth, legendHeight } = addLegend({
    showLegend: conditionalColors.length === 0 ? showLegend : "none",
    svg,
    dataKeys,
    color,
    margin,
    LegendWrapper,
    LegendTextStyle,
    LegendGroup,
    ArrowStyle,
    ArrowDisabledStyle,
  });

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

  heightValue = heightValue - titleHeight - subTitleHeight - legendHeight;

  heightValue = legendHeight > 0 ? heightValue - 5 : heightValue;

  // X scale
  const x = d3
    .scaleBand()
    .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0) // This does nothing ?
    .domain(qDataSet.map((d) => d[Object.keys(d)[0]])); // The domain of the X axis is the list of states.

  // Y scale
  const y = scaleRadial()
    // .range([innerRadius, outerRadius]) // Domain will be define later.
    .range([innerRadius, Math.min(screenWidth, heightValue) / 2]) // Domain will be define later.
    .domain([0, qMax]); // Domain of Y is from 0 to the max seen in the data

  const g = diagram.attr(
    "transform",
    `translate(${screenWidth / 2},${heightValue / 2 +
      titleHeight +
      subTitleHeight})` // + 100 ??
  );

  // Add bars
  g.append("g")
    .selectAll("path")
    .data(qDataSet)
    .enter()
    .append("path")
    .style("fill", (d, i) => color(dataKeys[i]))
    .attr("elemNumber", (d) => d.elemNumber)
    .attr(
      "d",
      d3
        .arc() // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius((d) => y(d[Object.keys(d)[2]]))
        .startAngle((d) => x(d[Object.keys(d)[0]]))
        .endAngle((d) => x(d[Object.keys(d)[0]]) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)
    )
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut)
    .on("click", allowSelections ? handleClick : null);

  // Add the labels
  const labels = g
    .selectAll("g")
    .data(qDataSet)
    .enter()
    .append("g")
    .attr("text-anchor", (d) =>
      (x(d[Object.keys(d)[0]]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
      Math.PI
        ? "end"
        : "start"
    )
    .attr(
      "transform",
      (d) =>
        `rotate(${((x(d[Object.keys(d)[0]]) + x.bandwidth() / 2) * 180) /
          Math.PI -
          90})` + `translate(${y(d[Object.keys(d)[2]]) + 10},0)`
    )
    .append("text")
    .text((d) => d[Object.keys(d)[0]])
    .attr("transform", (d) =>
      (x(d[Object.keys(d)[0]]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
      Math.PI
        ? "rotate(180)"
        : "rotate(0)"
    );
  // .style('font-size', '11px')
  // .attr('alignment-baseline', 'middle');

  setStyle(labels, BarPlotLabelStyle);
}
