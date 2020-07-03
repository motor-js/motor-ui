import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";
import {
  addTitle,
  addSubTitle,
  addLegend,
  addTooltip,
  showTooltip,
  hideTooltip,
} from "../../D3";

import { setStyle } from "../../D3/Helpers";
import {
  roundNumber,
  hyperCubeTransform,
  getMeasureNames,
  groupHyperCubeData,
  stackHyperCubeData,
  colorByExpression,
} from "../../../utils";

export default function CreateBar({
  qLayout,
  qData,
  // propsWidth,
  propsHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionBarVisible,
  selections,
  select,
  // buildSelections,
  stacked,
  percentStacked,
  title,
  subTitle,
  showLegend,
  allowSelections,
  maxWidth,
  showAxis,
  maxAxisLength,
  BarThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  showLabels,
  allowZoom,
  suppressScroll,
  scrollRatio,
  barPadding,
  textOnAxis,
  tickSpacing,
  showGridlines,
  allowSlantedYAxis,
} = chartSettings) {
  const { qMeasureInfo, qDimensionInfo } = qLayout.qHyperCube;
  const { qMatrix } = qData;
  const qDimensionCount = qDimensionInfo.length;
  const qMeasureCount = qMeasureInfo.length;
  const measureStartPosition = qDimensionCount * 2;
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
    BarChartStyle,
    BarDefault,
    BarStyle,
    GridLineStyle,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    BarLabelStyle,
    BarOverviewBar,
    SelectedBar,
    NonSelectedBar,
    colorPalette,
  } = BarThemes;

  const chartDataShape =
    qDimensionCount === 1 && qMeasureCount === 1
      ? "singleDimensionMeasure"
      : qDimensionCount == 1
      ? "singleDimension"
      : percentStacked
      ? "percentStacked"
      : stacked
      ? "stackedChart"
      : "multipleDimensions";

  const isPercentage = chartDataShape === "percentStacked";
  let pendingSelections = [];

  const maxBarWidth = maxWidth || BarDefault.maxWidth;

  let qMax = Math.max(0, ...qMeasureInfo.map((d) => d.qMax));
  let qMin = Math.min(0, ...qMeasureInfo.map((d) => d.qMin));

  const delayMilliseconds = 1500;
  const selectorWidth = 70;

  let height;
  // let heightOverview;
  let yAxisOrientation = "Standard";

  let yOverview = null;
  let xScale = null;
  let titleHeights = 0;

  const uuid = uuidv4();

  // Check if width is % or number in px
  let width = screenWidth;
  // let width = /^\d+(\.\d+)?%$/.test(propsWidth)
  //   ? (+parseInt(propsWidth, 10) / 100) * screenWidth
  //   : +parseInt(propsWidth, 10);

  // Check if height is % or number in px
  const heightValue = /^\d+(\.\d+)?%$/.test(propsHeight)
    ? (+parseInt(propsHeight, 10) / 100) * window.innerHeight
    : +parseInt(propsHeight, 10);

  const margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 50,
  };

  const marginOverview = {
    top: margin.top,
    right: margin.right,
    bottom: margin.bottom,
    left: 10,
  };

  const qDataSet = hyperCubeTransform(qData, qLayout.qHyperCube);

  const svgWidth = width;

  d3.select(d3Container.current)
    .select("svg")
    .remove();

  const svg = d3
    .select(d3Container.current)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", heightValue);

  setStyle(svg, BarChartStyle);

  let rangeBands = [];
  let data = qDataSet;

  let paddingShift = 0;

  const getDimensionCategories = (data) => [
    ...new Set(data.map((d) => d[Object.keys(d)[2]])),
  ];

  let categories = null;
  let items = null;

  switch (chartDataShape) {
    case "singleDimensionMeasure":
      rangeBands = data.map((d) => d[Object.keys(d)[0]]);
      break;
    case "singleDimension":
      rangeBands = getMeasureNames(qLayout.qHyperCube);
      break;
    case "multipleDimensions":
      [data, rangeBands, paddingShift] = groupHyperCubeData(data);
      categories = getDimensionCategories(data);
      items = [...new Set(rangeBands.map((d) => d.split("|")[0]))];
      break;
    case "stackedChart":
    case "percentStacked":
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
    showLegend: conditionalColors.length === 0 ? showLegend : "none",
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

  const legendLeftPadding = legendWidth !== 0 ? margin.right : 0;

  width = width - margin.left - margin.right - legendWidth;

  const yScale = d3.scaleLinear().domain([0, data.length]);

  let xAxisTextHeight = 0;
  let longAxisLabels = false;
  let xAxisText = null;

  // const new_data = null;

  // Width and Height of Axis
  let yAxisWidth = 0;
  let xAxisHeight = 0;

  // Width and Height of text labels
  let labelTextWidth = 0;
  let labelTextWidthNegative = 0;
  // let labelTextHeight = 0;

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize([])
    .tickPadding(10)
    .tickValues(d3.range(0, data.length, 1));

  const xAxisOverview = d3
    .axisLeft(yScale)
    .tickValues([])
    .tickSize([]);
  let yOverviewSecondary = null;

  const yScaleSecondary = d3.scaleBand();

  let padding = barPadding || BarDefault.barPadding;

  let barWidth = 0;

  function getYAxisLabelSize() {
    let barHeight = barWidth;

    if (chartDataShape === "multipleDimensions") {
      barHeight *= categories.length;
    }

    const newItem = svg.append("g");

    let longest = "";
    let longestLength = 0;

    const container = newItem
      .append("text")
      .attr("y", 0)
      .attr("dy", 0)
      .text(longest);

    data.map((d) => {
      container.text(d[Object.keys(d)[0]]);
      if (newItem.node().getBBox().width > longestLength) {
        longest = d[Object.keys(d)[0]];
        longestLength = newItem.node().getBBox().width;
      }
    });

    container.text(longest);

    if (newItem.node().getBBox().width <= maxAxisLength) {
      const size = newItem.node().getBBox();
      newItem.remove();

      return size;
    }

    longAxisLabels = true;
    do {
      longest = longest.substring(0, longest.length - 1);

      container.text(longest + "...");
    } while (newItem.node().getBBox().width > maxAxisLength);

    // If labels are longer than bandwidth wrap them
    // container.call(wrap, barHeight * qMeasureCount);
    // yAxisOrientation = 'Wrapped';

    // if (barHeight * qMeasureCount >= newItem.node().getBBox().height) {
    //   const size = newItem.node().getBBox();
    //   newItem.remove();

    //   return size;
    // }

    if (allowSlantedYAxis) {
      container.attr("transform", "translate(0,2) rotate(-45)");

      yAxisOrientation = "Rotated";
    }

    const size = newItem.node().getBBox();

    newItem.remove();

    return size;
  }

  const yAxisLableSize = getYAxisLabelSize();
  // const yAxisLableSize = 0;

  yAxisWidth =
    yAxisLableSize.width - (isScrollDisplayed ? marginOverview.right : 0);

  const diagram = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", `translate(${margin.left + yAxisWidth},${margin.top})`);

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

  const formatValue = (val, precision, sign) => {
    let formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  let decimals = 0;
  const numFormat = qMeasureInfo[0].qNumFormat;

  if (
    qMeasureInfo[0].qNumFormat.qType !== "U" &&
    qMeasureInfo[0].qNumFormat.qFmt.includes("%")
  ) {
    decimals = `,.${
      numFormat.qFmt.slice(
        numFormat.qFmt.indexOf(numFormat.qDec) + 1,
        numFormat.qFmt.indexOf("%")
      ).length
    }%`;
  }

  function setHeight() {
    height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
    // heightOverview = height;

    svg.attr("height", height + margin.top + margin.bottom);

    const xAxisHeightText = svg.append("text").text(formatValue(qMax));

    xAxisHeight = xAxisHeightText.node().getBBox().height; //+ (showScroll ? 10 : 0);

    xAxisHeightText.remove();

    titleHeights =
      titleHeight + subTitleHeight || `${parseInt(margin.top + xAxisHeight)}`;

    // Reduce top margin if Titles take up much space.

    titleHeights =
      titleHeights /
        (height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight) >
      1
        ? (titleHeights -= margin.top / 2)
        : titleHeights;

    titleHeights = titleHeights > 0 ? titleHeights - margin.top : titleHeights;

    if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
      // text label for the x axis
      xAxisText = svg.append("text").text("Values");

      xAxisTextHeight =
        xAxisText.node().getBBox().height + (showScroll ? 10 : 0);

      xAxisText.remove();
    }

    if (showLabels !== "none") {
      const textValue =
        qMeasureInfo[0].qNumFormat.qType === "U" ||
        qMeasureInfo[0].qNumFormat.qFmt === "##############" ||
        qMeasureInfo[0].qNumFormat.qFmt === "########" ||
        qMeasureInfo[0].qNumFormat.qFmt === "###0" ||
        chartDataShape === "stackedChart" ||
        chartDataShape === "percentStacked"
          ? formatValue(qMax)
          : d3.format(decimals)(qMax);

      const sampleText = svg
        .selectAll(".sampleText")
        .data([textValue])
        .enter()
        .append("text")
        .text((d) => d);

      setStyle(sampleText, BarLabelStyle);
      labelTextWidth = sampleText.node().getBBox().width;
      // labelTextHeight = sampleText.node().getBBox().height;

      sampleText.remove();

      if (qMin < 0) {
        const textValue =
          qMeasureInfo[0].qNumFormat.qType === "U" ||
          qMeasureInfo[0].qNumFormat.qFmt === "##############" ||
          qMeasureInfo[0].qNumFormat.qFmt === "########" ||
          qMeasureInfo[0].qNumFormat.qFmt === "###0" ||
          chartDataShape === "stackedChart" ||
          chartDataShape === "percentStacked"
            ? formatValue(qMin)
            : d3.format(decimals)(qMin);

        const sampleText = svg
          .selectAll(".sampleText")
          .data([textValue])
          .enter()
          .append("text")
          .text((d) => d);

        labelTextWidthNegative = sampleText.node().getBBox().width;

        sampleText.remove();
      }
    }

    yScale.range([
      0,
      height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight,
    ]);
  }

  setHeight();

  const showScroll =
    !(suppressScroll || BarDefault.suppressScroll) || scrollRatio;

  if (chartDataShape === "multipleDimensions") {
    const multiDimWidth =
      height - margin.top - titleHeights - legendHeight - xAxisHeight;

    // const multiDimWidth = yScale.range()[1];

    barWidth = multiDimWidth / (data.length + items.length);
    let noOfItems = 0;
    let paddingItem = -1;
    data.forEach((item, index) => {
      if (paddingItem === item.paddingShift) noOfItems++;
      paddingItem = item.paddingShift;
      item.x = barWidth * noOfItems + index * barWidth;
    });
  } else if (
    height - titleHeights - legendHeight - xAxisHeight - padding * data.length >
    0
  ) {
    barWidth =
      (height -
        titleHeights -
        legendHeight -
        xAxisHeight -
        `${padding * data.length * (data.length === 1 ? 1.5 : 1)}`) /
      data.length /
      qMeasureCount;

    if (
      typeof barPadding === "undefined" &&
      barWidth < BarDefault.zoomScrollOnBarHeight
    ) {
      // const chartWidth = height - titleHeights - legendHeight - xAxisHeight;
      const chartWidth = yScale.range()[1];
      barWidth =
        (chartWidth - BarDefault.barPaddingNarrow * data.length) /
        data.length /
        qMeasureCount;

      padding = barPadding || BarDefault.barPaddingNarrow;
    }
  } else {
    const chartWidth = height - titleHeights - legendHeight - xAxisHeight;

    if (chartWidth - (BarDefault.barPaddingNarrow / 2) * data.length > 0) {
      barWidth =
        (chartWidth - (BarDefault.barPaddingNarrow / 2) * data.length) /
        data.length /
        qMeasureCount;

      padding = barPadding || BarDefault.barPaddingNarrow / 2;
    } else {
      barWidth = (chartWidth - data.length) / data.length / qMeasureCount;
      padding = 1;
    }
  }

  if (barWidth > maxBarWidth) barWidth = maxBarWidth;

  const isScrollDisplayed =
    (showScroll && barWidth < BarDefault.zoomScrollOnBarHeight) ||
    (showScroll && scrollRatio);

  switch (chartDataShape) {
    case "singleDimension":
      yScaleSecondary
        .domain(rangeBands)
        .rangeRound([0, barWidth * qMeasureCount]);

      yOverviewSecondary = d3
        .scaleBand()
        .domain(rangeBands)
        .rangeRound([0, barWidth * qMeasureCount]);

      break;
    case "multipleDimensions":
      yAxis.tickValues(d3.range(0, items.length, 1));
      break;
  }

  function createXAxis(diagram, data) {
    let shiftForNegatives = 0;
    switch (chartDataShape) {
      case "singleDimensionMeasure":
      case "singleDimension":
      case "stackedChart":
      case "percentStacked":
        xScale.domain([qMin === 0 ? qMin : qMin, qMax]);
        shiftForNegatives =
          showLabels === "top" ||
          chartDataShape === "percentStacked" ||
          chartDataShape === "stackedChart"
            ? ((labelTextWidthNegative + xScale(0)) * 1.03) / xScale(0)
            : 1.02;

        xScale.domain([qMin === 0 ? qMin : qMin * shiftForNegatives, qMax]);
        break;
      case "multipleDimensions":
        xScale.domain([
          Math.min(
            0,
            d3.min(data, (d) => d[Object.keys(d)[4]])
          ),
          Math.max(
            0,
            d3.max(data, (d) => d[Object.keys(d)[4]])
          ),
        ]);

        shiftForNegatives =
          showLabels === "top"
            ? ((labelTextWidthNegative + xScale(0)) * 1.03) / xScale(0)
            : 1.02;

        xScale.domain([qMin === 0 ? qMin : qMin * shiftForNegatives, qMax]);
        break;
    }

    const xAxis = d3.axisBottom(xScale);

    if (chartDataShape === "percentStacked") {
      switch (tickSpacing) {
        case "wide":
          xAxis.ticks(xScale.ticks().length * 0.5, "%");
          break;
        case "normal":
          xAxis.ticks(10, "%");
          break;
        case "narrow":
          xAxis.ticks(xScale.ticks().length * 1.5, "%");
          break;
      }
    } else {
      switch (tickSpacing) {
        case "wide":
          xAxis.ticks(xScale.ticks().length * 0.5);
          break;
        case "normal":
          break;
        case "narrow":
          xAxis.ticks(xScale.ticks().length * 1.5);
          break;
      }
    }

    if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
      // text label for the x axis
      xAxisText = diagram
        .append("text")
        .style("text-anchor", "middle")
        .text(qMeasureInfo.map((measure) => measure.qFallbackTitle).join(", "));

      setStyle(xAxisText, axisTitleStyle);
    }

    const x = diagram
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        `translate(0,${height - xAxisHeight - xAxisTextHeight - legendHeight})`
      )
      .call(xAxis);

    setStyle(x, xAxisStyle);

    if (["none", "yAxis"].some((substring) => showAxis.includes(substring))) {
      diagram
        .select(".x.axis")
        .select(".domain")
        .remove();

      diagram
        .select(".x.axis")
        .selectAll(".tick")
        .selectAll("line")
        .remove();
    }

    const xValues = x.selectAll("g.tick");

    xValues.each(function(i) {
      const self = d3.select(this);
      const textItem = self.select("text");

      const newValue =
        qMeasureInfo[0].qNumFormat.qType !== "U" &&
        qMeasureInfo[0].qNumFormat.qFmt.includes("%")
          ? d3.format(decimals)(textItem.text())
          : formatValue(parseFloat(textItem.text().replace(/,/g, "")), true);
      textItem.text(newValue);
    });

    if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
      xAxisText.attr(
        "transform",
        `translate(${xScale.range()[1] / 2} ,${height +
          margin.top -
          legendHeight})`
      );
    }

    if (
      ["solid", "dashes", "dots", "default"].some((substring) =>
        showGridlines.includes(substring)
      )
    ) {
      // Y Gridline
      const gridlines = d3
        .axisBottom()
        .tickFormat("")
        .tickSize(-(height - margin.top - xAxisHeight - titleHeights))
        .scale(xScale);

      switch (tickSpacing) {
        case "wide":
          gridlines.ticks(xScale.ticks().length * 0.5);
          break;
        case "normal":
          break;
        case "narrow":
          gridlines.ticks(xScale.ticks().length * 1.5);
          break;
      }

      const x_gridlines = diagram
        .append("g")
        .attr("class", "grid")
        .attr(
          "transform",
          `translate(0,${height -
            // titleHeights -
            xAxisHeight -
            xAxisTextHeight -
            legendHeight})`
        )
        .call(gridlines);

      const x_gridlines_lines = x_gridlines.selectAll("g.tick line");
      setStyle(x_gridlines_lines, GridLineStyle);

      switch (showGridlines) {
        case "dashes":
          x_gridlines_lines.style("stroke-dasharray", "13, 13");
          break;
        case "solid":
          x_gridlines_lines.style("stroke-dasharray", "0, 0");
          break;
        case "dots":
          x_gridlines_lines.style("stroke-dasharray", "3,3");
          break;
        case "default":
          setStyle(x_gridlines_lines, GridLineStyle);
          break;
      }

      x_gridlines.selectAll(".domain").remove();
    }
  }

  const getDimension = (dim) =>
    qDataSet.filter((d) => dim === d[Object.keys(d)[0]])[0];

  const setBarColors = (diagram) => {
    switch (chartDataShape) {
      case "singleDimensionMeasure":
        diagram.selectAll("[data-legend]").each(function() {
          const self = d3.select(this);
          let selected = false;
          self.style("fill", (d, index) => {
            selected = pendingSelections.includes(d.elemNumber);

            return color(d[Object.keys(d)[0]]);
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedBar)
              : setStyle(self, NonSelectedBar);
          }
        });
        break;
      case "singleDimension":
        diagram.selectAll("[data-legend]").each(function(item, barIndex) {
          const self = d3.select(this);
          let selected = false;
          const index = +self.attr("data-measure-index");

          self.style("fill", (d) => {
            selected = pendingSelections.includes(d.elemNumber);
            return color(
              conditionalColors.length === 0 ? rangeBands[index] : barIndex
            );
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedBar)
              : setStyle(self, NonSelectedBar);
          }
        });
        break;
      case "stackedChart":
      case "percentStacked":
        diagram.selectAll("[data-legend]").each(function() {
          const self = d3.select(this);
          let selected = false;
          self.style("fill", (d) => {
            const data = getDimension(d3.select(this).attr("data-parent"));
            selected = pendingSelections.includes(data.elemNumber);

            return color(d.key);
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedBar)
              : setStyle(self, NonSelectedBar);
          }
        });
        break;
      case "multipleDimensions":
        diagram.selectAll("[data-legend]").each(function(item, i) {
          const self = d3.select(this);
          let selected = false;
          self.style("fill", (d) => {
            selected = pendingSelections.includes(d.elemNumber);

            return color(
              conditionalColors.length === 0 ? d[Object.keys(d)[2]] : i
            );
          });
          if (useSelectionColours) {
            selected
              ? setStyle(self, SelectedBar)
              : setStyle(self, NonSelectedBar);
          }
        });
        break;
    }
  };

  // // Create Event Handlers for mouse
  // function handleClick(d, i) {
  //   let dim = d;

  //   d = d3.select(this).attr('data-parent') || d;

  //   if (typeof d !== 'object') {
  //     dim = getDimension(d);
  //   }

  //   if (typeof d === 'number') {
  //     dim = new_data
  //       ? new_data[Object.keys(new_data)[d]]
  //       : data[Object.keys(data)[d]];
  //   }

  //   setRefreshChart(false);
  //   useSelectionColours = true;

  //   let updateList = [];
  //   const selectionValue = dim[Object.keys(dim)[1]];

  //   if (pendingSelections.includes(selectionValue)) {
  //     updateList = pendingSelections.filter((item) => item != selectionValue);
  //     pendingSelections = updateList;
  //   } else {
  //     pendingSelections = [...pendingSelections, selectionValue];
  //   }

  //   setBarColors(diagram);

  //   beginSelections();

  //   setSelectionBarVisible(true);

  //   buildSelections(pendingSelections);
  // }

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    let dim = d;

    d = d3.select(this).attr("data-parent") || d;

    if (typeof d !== "object") {
      dim = getDimension(d);
    }

    if (chartDataShape === "multipleDimensions" && typeof d === "number") {
      dim = data[Object.keys(data)[d * categories.length]];
    } else if (typeof d === "number") {
      dim = data[Object.keys(data)[d]];
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

    setBarColors(diagram);

    beginSelections();

    setSelectionBarVisible(true);

    // if (!selections) return;
    // let itemsSelected = null;
    // if (selections.length !== 0) {
    //   itemsSelected = [
    //     ...new Set(
    //       selections.map((d, i) => {
    //         return d[Object.keys(d)[0]].qElemNumber;
    //       })
    //     ),
    //   ];

    //   if (pendingSelections.length !== 1) {
    //     select(0, [dim[Object.keys(dim)[1]]]);
    //   } else {
    //     select(
    //       0,
    //       itemsSelected.filter((e) => e !== dim[Object.keys(dim)[1]])
    //     );
    //   }
    // } else {
    //   select(0, [dim[Object.keys(dim)[1]]]);
    // }

    // buildSelections(pendingSelections);

    select(0, pendingSelections);
  }

  const tooltipContainer = d3.select(d3Container.current);
  const tooltip = addTooltip({
    tooltipContainer,
    TooltipWrapper,
  });

  function handleMouseOver() {
    d3.select(this).style("cursor", "pointer");
  }

  function handleMouseMove(d, i) {
    d3.select(this).style("cursor", "pointer");

    let cursorLocation = d3.mouse(this);
    let data = {};
    let item = null;

    switch (chartDataShape) {
      case "singleDimensionMeasure":
        data = {
          key: d[Object.keys(d)[0]],
          value:
            qMeasureInfo[0].qNumFormat.qType === "U" ||
            qMeasureInfo[0].qNumFormat.qFmt === "##############" ||
            qMeasureInfo[0].qNumFormat.qFmt === "########" ||
            qMeasureInfo[0].qNumFormat.qFmt === "###0"
              ? formatValue(d[Object.keys(d)[2]])
              : qMatrix[i][qDimensionCount].qText,
        };
        break;
      case "singleDimension":
        const measureNo = rangeBands.indexOf(
          d3.select(this).attr("data-legend")
        );

        const toolTipValue =
          qMeasureInfo[measureNo].qNumFormat.qType === "U" ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === "##############" ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === "########" ||
          qMeasureInfo[measureNo].qNumFormat.qFmt === "###0"
            ? formatValue(d3.select(this).attr("data-value"))
            : qMatrix[i][qDimensionCount + measureNo].qText;
        data = {
          key: d[Object.keys(d)[0]],
          value: `${d3.select(this).attr("data-legend")} : ${toolTipValue}`,
        };
        cursorLocation = [
          d3.mouse(this)[0],
          this.parentNode.transform.baseVal[0].matrix.f + d3.mouse(this)[1],
        ];
        break;
      case "stackedChart":
        data = {
          key: d.dimension,
          value: `${d.key} : ${formatValue(d.value)}`,
        };
        break;
      case "percentStacked":
        data = {
          key: d.dimension,
          value: `${d.key}<br/>${d3.format(".0%")(d.value)}`,
        };
        break;
      case "multipleDimensions":
        const key = d[Object.keys(d)[0]];

        const legendItem = d[Object.keys(d)[2]];

        const value =
          qMeasureInfo[0].qNumFormat.qType === "U" ||
          qMeasureInfo[0].qNumFormat.qFmt === "##############" ||
          qMeasureInfo[0].qNumFormat.qFmt === "########" ||
          qMeasureInfo[0].qNumFormat.qFmt === "###0"
            ? formatValue(d3.select(this).attr("data-value"))
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

  function setYAxisInteractivity() {
    diagram
      .selectAll(".y.axis .tick")
      .on("click", allowSelections ? handleClick : null)
      .on("mouseover", handleMouseOver);
  }

  const xScaleCalc = (d, index) =>
    qDimensionCount === 1
      ? xScale(d[Object.keys(d)[index]])
      : xScale(
          qMeasureInfo[0].qFallbackTitle.slice(0, 1) === "="
            ? d.value
            : d[qMeasureInfo[0].qFallbackTitle]
        );

  const xOverviewCalc = (d, index) =>
    qDimensionCount === 1
      ? xOverview(d[Object.keys(d)[index]])
      : xOverview(
          qMeasureInfo[0].qFallbackTitle.slice(0, 1) === "="
            ? d.value
            : d[qMeasureInfo[0].qFallbackTitle]
        );

  const drawBars = (diagram, measureName, index) => {
    const bars = diagram
      .enter()
      .append("rect")
      .attr("data-legend", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
            return rangeBands[i];
          case "singleDimension":
            return measureName;
          case "stackedChart":
          case "percentStacked":
            return d.key;
          case "multipleDimensions":
            return d[Object.keys(d)[2]];
        }
      })
      .attr("data-dimension", (d, i) => {
        if (chartDataShape === "multipleDimensions") {
          return d[Object.keys(d)[0]];
        }

        return null;
      })
      .attr("data-value", (d) => d[Object.keys(d)[index]])
      .attr(
        "data-parent",
        chartDataShape === "stackedChart" || chartDataShape === "percentStacked"
          ? (d) => d.dimension
          : null
      )
      .attr(
        "data-measure-index",
        chartDataShape === "singleDimension"
          ? index - qDimensionCount - 1
          : null
      )
      .on("click", allowSelections ? handleClick : null)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
      .attr("x", xScale(0))
      .attr("width", 0)
      .attr("y", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
            return yScale(i); //+ padding;
          case "stackedChart":
          case "percentStacked":
            return yScale(d.dimIndex); //+ padding;
          case "singleDimension":
            return yScaleSecondary(measureName); //+ padding;
          case "multipleDimensions":
            // return d.x - barWidth;
            return d.x;
        }
      })
      .attr("height", barWidth)
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)

      .attr("x", (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
          case "multipleDimensions":
            return xScale(Math.min(d[Object.keys(d)[index]], 0));
          case "stackedChart":
          case "percentStacked":
            return xScale(d[0]);
        }
      })
      .attr("width", (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
          case "multipleDimensions":
            return Math.abs(xScaleCalc(d, index) - xScale(0));
          case "stackedChart":
          case "percentStacked":
            return xScale(d[1]) - xScale(d[0]);
        }
      })
      .attr("dominant-baseline", "central");

    setStyle(bars, BarStyle);
  };

  const drawBarLabels = (barLabels, measureName, index) => {
    const labelPosition =
      showLabels == "top" ? ["end", "start"] : ["start", "end"];
    const labelShift = showLabels === "top" ? [-5, 5] : [5, -5];

    const labels = barLabels
      .enter()
      .append("text")
      .classed("bar-label-text", true)
      .attr("text-anchor", (d) => {
        let labelPosition = null;

        if (
          chartDataShape === "stackedChart" ||
          chartDataShape === "percentStacked"
        ) {
          if (d.total < 0) {
            labelPosition = "end";
          } else {
            labelPosition = "top";
          }
        } else if (showLabels === "top") {
          if (d[Object.keys(d)[index]] < 0) {
            labelPosition = "end";
          } else {
            labelPosition = "top";
          }
        } else {
          // negative values
          if (d[Object.keys(d)[index]] < 0) {
            if (
              Math.abs(xScale(d[Object.keys(d)[index]]) - xScale(0)) >
              labelTextWidthNegative
            ) {
              labelPosition = "top";
            } else {
              labelPosition = "end";
            }
          } else {
            if (
              Math.abs(xScale(d[Object.keys(d)[index]]) - xScale(0)) >
              labelTextWidth
            ) {
              labelPosition = "end";
            } else {
              labelPosition = "top";
            }
          }
        }
        return labelPosition;
      })
      .attr("x", xScale(0))
      .attr("width", 0)
      .attr("dy", ".32em")
      .attr("y", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "stackedChart":
          case "percentStacked":
            return yScale(i) + barWidth / 2;
          case "singleDimension":
            return yScaleSecondary(measureName) + barWidth / 2;
          case "multipleDimensions":
            // return d.x - barWidth / 2;
            return d.x + barWidth / 2;
        }
      })
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)
      .text((d, i) => {
        if (
          chartDataShape === "stackedChart" ||
          chartDataShape === "percentStacked"
        ) {
          return formatValue(d.total);
        } else {
          return qMeasureInfo[index - measureStartPosition].qNumFormat.qType ===
            "U" ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              "##############" ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              "########" ||
            qMeasureInfo[index - measureStartPosition].qNumFormat.qFmt ===
              "###0"
            ? formatValue(d[Object.keys(d)[index]])
            : qMatrix[i][index - measureStartPosition + qDimensionCount].qText;
        }
      });

    labels.attr("x", (d) => {
      let xValue = null;
      if (chartDataShape === "stackedChart") {
        if (d.total < 0) {
          return `${xScale(d.total) - 5}`;
        } else {
          return `${xScale(d.total) + 5}`;
        }
      } else if (showLabels === "top") {
        if (d[Object.keys(d)[index]] < 0) {
          return `${xScale(d[Object.keys(d)[index]]) + labelShift[0]}`;
        } else {
          return `${xScale(d[Object.keys(d)[index]]) + labelShift[1]}`;
        }
      } else {
        if (d[Object.keys(d)[index]] < 0) {
          if (
            Math.abs(xScaleCalc(d, index) - xScale(0)) > labelTextWidthNegative
          ) {
            xValue = `${xScale(d[Object.keys(d)[index]]) + labelShift[0]}`;
          } else {
            // if showLables = "inside" and label larger than bar, move lable outside of bar
            xValue = `${xScale(d[Object.keys(d)[index]]) - 5}`;
          }
        } else {
          if (Math.abs(xScaleCalc(d, index) - xScale(0)) > labelTextWidth) {
            xValue = `${xScale(d[Object.keys(d)[index]]) + labelShift[1]}`;
          } else {
            // if showLables = "inside" and label larger than bar, move lable outside of bar
            xValue = `${xScale(d[Object.keys(d)[index]]) + labelShift[0]}`;
          }
        }
        return xValue;
      }
    });

    setStyle(labels, BarLabelStyle);
  };

  const yAxisDiag = diagram
    .append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(0,${titleHeights})`)
    .call(yAxis);

  setStyle(yAxisDiag, yAxisStyle);

  if (["none", "xAxis"].some((substring) => showAxis.includes(substring)))
    diagram
      .select(".y.axis")
      .select(".domain")
      .remove();

  function setWidth() {
    yOverview = d3
      .scaleLinear()
      .range(yScale.range())
      .domain(yScale.domain());

    xScale = d3.scaleLinear().range([
      0,
      width -
        margin.right -
        yAxisWidth -
        labelTextWidth -
        legendLeftPadding -
        `${isScrollDisplayed ? selectorWidth : 0}`, // adj here for negative values?
    ]);
  }

  diagram
    .select(".y.axis")
    .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
    .selectAll(".tick text")
    .text((d, i) => {
      const item = Object.entries(data[i]).filter(
        (d) => d[0] === qDimensionInfo[0].qFallbackTitle
      );

      return item[0][1];
    });

  // Adjust Y axis location

  if (!isScrollDisplayed) {
    diagram
      .select(".y.axis")
      .selectAll(".tick")
      .attr("transform", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "stackedChart":
          case "percentStacked":
            // return `translate(0,${yScale(i) + barWidth - padding})`;
            return `translate(0,${
              // yScale(i) +
              //   (padding === BarDefault.barPadding
              //     ? // ? titleHeights + padding / 2 + barWidth / 2
              //       margin.top + xAxisHeight + barWidth / 2
              //     : barWidth)
              yScale(i) +
                (padding === BarDefault.barPadding
                  ? // ? titleHeights + padding / 2 + barWidth / 2
                    margin.top + xAxisHeight + barWidth / 2
                  : margin.top + barWidth / 2)
              // padding / 2 +
              // barWidth / 2
            })`;
          // return `translate(0,${yScale(i) + barWidth})`;
          case "singleDimension":
            // return `translate(0,${yScale(i) +
            //   (barWidth / 2) * qMeasureCount +
            //   barWidth / 2 +
            //   padding / 2})`;
            return `translate(0,${yScale(i) +
              titleHeights +
              padding / 2 +
              (barWidth * qMeasureCount) / 2})`;
        }
      });
  }

  function shiftYAxis() {
    if (chartDataShape === "multipleDimensions") {
      const ticks = diagram.select(".y.axis").selectAll("g.tick");
      ticks.each(function(i) {
        const self = d3.select(this);
        self.select("text").text(items[i]);
        const rects = diagram.selectAll(`rect[data-dimension="${items[i]}"]`);
        const start = rects._groups[0][0].y.baseVal.value;
        const end =
          rects._groups[0][rects._groups[0].length - 1].y.baseVal.value +
          rects._groups[0][rects._groups[0].length - 1].height.baseVal.value;
        // const transformValue = start + (end - start) / 2 + xAxisHeight / 2;
        const transformValue =
          start + (end - start) / 2 - xAxisHeight + padding;
        self.attr("transform", (d, index) => `translate(0,${transformValue})`);
      });
    } else {
      if (yAxisOrientation !== "Rotated") {
        const ticks = diagram.select(".y.axis").selectAll("g.tick");
        ticks.each(function(i, index, item) {
          const self = d3.select(this);
          self
            .select("text")
            .attr(
              "transform",
              `translate(0,  ${(!isScrollDisplayed &&
              padding >= BarDefault.barPadding
                ? 0
                : margin.top) - xAxisHeight})`
            );
        });
      }
    }
  }

  yAxisLabels();

  createBars(diagram, data);

  if (
    ["both", "yAxis"].some((substring) => showAxis.includes(substring)) &&
    xScale(0) !== 0
  ) {
    diagram
      .append("line")
      .attr("transform", `translate(0,${titleHeights})`)
      .attr("y1", 0)
      .attr("y2", yScale.range()[1])
      .attr("x1", xScale(0))
      .attr("x2", xScale(0))
      .attr("stroke", "black");

    diagram
      .select(".y.axis")
      .select(".domain")
      .remove();
  }

  const xOverview = d3
    .scaleLinear()
    .range([0, selectorWidth])
    .domain(xScale.domain());

  if (showLabels !== "none") createLabels(); // Value Labels for Chart Bars
  shiftYAxis();
  setYAxisInteractivity(diagram);

  function drawMiniChart(subBars, measureName, index) {
    const cols = subBars
      .enter()
      .append("rect")
      .attr("height", barWidth)
      .attr("width", (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
          case "multipleDimensions":
            return Math.abs(xOverviewCalc(d, index) - xOverview(0));
          case "stackedChart":
          case "percentStacked":
            return xOverview(d[1]) - xOverview(d[0]);
        }
      })
      .attr("x", (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
          case "multipleDimensions":
            return xOverview(Math.min(d[Object.keys(d)[index]], 0));
          case "stackedChart":
          case "percentStacked":
            return xOverview(d[0]);
        }
      })
      .attr("y", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
            return yOverview(i) + padding;
          case "stackedChart":
          case "percentStacked":
            return yOverview(d.dimIndex) + padding;
          case "singleDimension":
            return yOverviewSecondary(measureName) + padding;
          case "multipleDimensions":
            return d.x;
        }
      })
      .attr("fill", (d, index) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
            return color(rangeBands[index]);
          case "singleDimension":
            return color(measureName);
          case "stackedChart":
          case "percentStacked":
            return color(d.key);
          case "multipleDimensions":
            return color(d.band.split("|")[1]);
        }
      })
      .attr("data-legend", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
            return rangeBands[i];
          case "singleDimension":
            return measureName;
          case "stackedChart":
          case "percentStacked":
            return d.key;
          case "multipleDimensions":
            return d.band.split("|")[1];
        }
      });
    setStyle(cols, BarOverviewBar);
  }

  function yAxisLabels() {
    if (yAxisOrientation === "Rotated") {
      const yAxisLabels = diagram
        .select(".y.axis")
        .selectAll("text")
        .attr("dy", ".35em")
        .attr(
          "transform",
          `translate(0,-${titleHeights + margin.top - xAxisHeight}) rotate(-45)`
        )
        .style("text-anchor", "end");
    }

    if (longAxisLabels) {
      const yAxisLabels = diagram.select(".y.axis").selectAll("text");
      yAxisLabels.each(function(i) {
        const self = d3.select(this);

        if (self.node().getBBox().width > maxAxisLength) {
          let axisText = self.text();
          do {
            axisText = axisText.substring(0, axisText.length - 1);
            self.text(axisText + "...");
          } while (self.node().getBBox().width > maxAxisLength);
        }
      });
    }

    if (["both", "yAxis"].some((substring) => textOnAxis.includes(substring))) {
      // text label for the x axis
      const yAxisText = diagram
        .append("text")
        .attr("transform", `rotate(-90) translate(0,${-yAxisWidth})`)
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(qDimensionInfo[0].qFallbackTitle);

      setStyle(yAxisText, axisTitleStyle);
    }

    setWidth();
  }

  const brush = d3
    .brushY()
    .extent([
      [0, 0],
      [selectorWidth, yScale.range()[1]],
    ])
    .on("brush", brushed);

  let scrollBarRatio = scrollRatio;

  function setupMiniChart() {
    if (
      chartDataShape === "stackedChart" ||
      chartDataShape === "percentStacked"
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
          data["dimension"] = z.data[Object.keys(z.data)[0]];
          data["elemNumber"] = z.data.elemNumber;
          data["value"] = z.data[v.key];
          data["dimIndex"] = z.data.dimIndex;
          y.push(data);
        });
        if (y.length !== 0) {
          data.push(y);
        }
      });
    }

    const context = svg
      .append("g")
      .attr("class", "context")
      .attr(
        "transform",
        "translate(" +
          (margin.left +
            xScale.range()[1] +
            yAxisWidth +
            labelTextWidth +
            marginOverview.left) +
          "," +
          `${titleHeights + marginOverview.top}` +
          ")"
      );

    let category_g2 = null;

    switch (chartDataShape) {
      case "singleDimensionMeasure":
      case "multipleDimensions":
        drawMiniChart(
          context.selectAll(".subBar").data(data),
          rangeBands[0],
          measureStartPosition
        );
        break;
      case "singleDimension":
        category_g2 = context
          .append("g")
          .classed("bars", true)
          .selectAll(".category")
          .data(data, (d) => d[Object.keys(d)[0]])
          .enter()
          .append("g")
          .attr("class", (d) => `extent category-${d[Object.keys(d)[0]]}`)
          .attr("transform", (d, i) => `translate(0,${yOverview(i)})`);

        qMeasureInfo.forEach((measure, index) => {
          const rects = category_g2.selectAll("category-rect").data((d) => [d]);

          drawMiniChart(rects, rangeBands[index], measureStartPosition + index);
        });

        break;
      case "stackedChart":
      case "percentStacked":
        const rects = context.selectAll("rect").data(data);

        var rect = rects
          .enter()
          .selectAll("rect")
          .data((d) => {
            d.forEach((d1) => {
              d1.key = d.key;

              return d1;
            });

            return d;
          });
        drawMiniChart(rect, rangeBands[0], measureStartPosition);

        break;
    }

    context
      .append("g")
      .attr("class", "x axis")
      .call(xAxisOverview);

    const barSettings = (settings) => {
      const { padding, height } = settings;

      barWidth = height;
      let i = 1;

      while (i <= yScale.range()[1]) {
        if (
          (yScale(1 / qMeasureCount) / i) * yScale.range()[1] <=
          height + padding
        ) {
          scrollBarRatio = i / yScale.range()[1];
          break;
        }
        i++;
      }
    };

    // if (barWidth < BarDefault.zoomScrollOnBarHeight && !scrollRatio) {
    if (barWidth < BarDefault.zoomScrollOnBarHeight && isScrollDisplayed) {
      if (!scrollRatio) {
        barSettings({
          padding: barPadding || BarDefault.barPaddingNarrow,
          height: BarDefault.zoomScrollOnBarHeight,
        });
      } else {
        (padding = barPadding || BarDefault.barPaddingNarrow),
          (barWidth = BarDefault.zoomScrollOnBarHeight);

        padding = BarDefault.barPaddingNarrow;
        let scrollItem = null;
        let i = 1;

        while (i <= yScale.range()[1]) {
          scrollItem = i;
          if (
            (yScale(1) / i) * yScale.range()[1] <=
            BarDefault.zoomScrollOnBarHeight + BarDefault.barPaddingNarrow
          ) {
            break;
          }

          i++;
        }
      }
    }

    context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, [
        yScale.range()[0],
        Math.ceil(yScale.range()[1] * scrollBarRatio), // here
      ]);

    //On a click recenter the brush window
    context.select(".overlay").on("mousedown.brush", brushcenter);
    // .on('touchstart.brush', brushcenter);

    if (allowZoom || BarDefault.allowZoom) {
    } else {
      // removes handle to resize the brush
      context.selectAll(".brush>.handle").remove();
      // removes crosshair cursor
      context.selectAll(".brush>.overlay").remove();
    }
  }

  // Group Setup for Value Labels for Chart Bars
  function createLabels() {
    let barLabels = null;
    let multiLabels = null;
    switch (chartDataShape) {
      case "singleDimensionMeasure":
        barLabels = diagram
          .append("g")
          .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
          .attr("class", "bar-labels")
          .attr("transform", `translate(0,${titleHeights + padding / 2})`)

          .selectAll(".bar-label-text")
          .data(data, (d) => d[Object.keys(d)[0]]);

        drawBarLabels(barLabels, rangeBands[0], measureStartPosition);
        break;
      case "singleDimension":
        multiLabels = diagram
          .append("g")
          .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
          .attr("class", "bar-labels")
          .attr("transform", `translate(0,${titleHeights + padding / 2})`)
          .selectAll(".model_name_labels")
          .data(data, (d) => d[Object.keys(d)[0]])
          .enter()
          .append("g")
          .classed("bar-group-labels", true)
          .attr("transform", (d, i) => `translate(${0},${yScale(i)})`);

        qMeasureInfo.forEach((measure, index) => {
          barLabels = multiLabels
            .selectAll(`text${rangeBands[index]}`)
            .data((d) => [d]);
          drawBarLabels(
            barLabels,
            rangeBands[index],
            measureStartPosition + index
          );
        });
        break;
      case "multipleDimensions":
        barLabels = diagram
          .append("g")
          .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
          .attr("class", "bar-labels")
          .attr("transform", `translate(0,${titleHeights})`)
          .selectAll(".bar-label-text")
          .data(data, (d) => d[Object.keys(d)[0]]);

        drawBarLabels(barLabels, rangeBands[0], measureStartPosition);
        break;
      case "stackedChart":
        barLabels = diagram
          .append("g")
          .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
          .attr("class", "bar-labels")
          .attr("transform", `translate(0,${titleHeights + padding / 2})`)
          .selectAll(".bar-label-text")
          .data(data);

        drawBarLabels(barLabels, rangeBands[0], measureStartPosition);
        break;
    }
  }

  function createBars(diagram, data) {
    createXAxis(diagram, data);

    if (
      chartDataShape === "stackedChart" ||
      chartDataShape === "percentStacked"
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
          data["dimension"] = z.data[Object.keys(z.data)[0]];
          data["elemNumber"] = z.data.elemNumber;
          data["value"] = z.data[v.key];
          data["dimIndex"] = z.data.dimIndex;
          y.push(data);
        });
        if (y.length !== 0) {
          data.push(y);
        }
      });
    }

    const rects = diagram
      .append("g")
      .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
      .classed("bars", true)
      .attr("transform", (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "stackedChart":
          case "percentStacked":
          case "singleDimension":
            return `translate(0,${titleHeights + padding / 2})`;
          case "multipleDimensions":
            return `translate(0,${titleHeights})`;
        }
      })
      .selectAll("rect")
      .data(data, (d) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
            return d[Object.keys(d)[0]];
          case "stackedChart":
          case "percentStacked":
          case "multipleDimensions":
            return data;
        }
      });

    let bars = null;
    switch (chartDataShape) {
      case "singleDimensionMeasure":
      case "multipleDimensions":
        drawBars(rects, rangeBands[0], measureStartPosition);
        break;
      case "singleDimension":
        bars = rects
          .enter()
          .append("g")
          .classed("bar-group", true)
          .attr("transform", (d, i) => `translate(0,${yScale(i)})`);

        qMeasureInfo.forEach((measure, index) => {
          const series = bars.selectAll(`rect${index}`).data((d) => [d]);

          drawBars(series, rangeBands[index], measureStartPosition + index);
        });
        break;
      case "stackedChart":
      case "percentStacked":
        var rect = rects
          .enter()
          // .append('g')
          .selectAll("rect")
          .data((d) => {
            d.forEach((d1) => {
              d1.key = d.key;

              return d1;
            });

            return d;
          });
        drawBars(rect, rangeBands[0], measureStartPosition);

        break;
    }

    setBarColors(diagram);
  }

  //Based on http://bl.ocks.org/mbostock/6498000
  //What to do when the user clicks on another location along the brushable bar chart
  function brushcenter() {
    console.log("to do");
    // const target = d3.event.target;
    // const extent = brush.extent();
    // const size = extent[1] - extent[0];
    // const range = yOverview.range();
    // const y0 = d3.min(range) + size / 2;
    // const y1 = d3.max(range) + yOverview.rangeBand() - size / 2; // here
    // const center = Math.max(y0, Math.min(y1, d3.mouse(target)[1]));

    // d3.event.stopPropagation();

    // context
    //   .call(brush.extent([center - size / 2, center + size / 2]))
    //   .call(brush.event);
  } //brushcenter

  if (isScrollDisplayed) {
    setupMiniChart();
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", uuid)
      .append("rect")
      .attr("x", -margin.left - yAxisWidth)
      .attr("width", width - margin.right - legendLeftPadding)
      .attr("height", yScale.range()[1]);
  }

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    const s = d3.event.selection || yOverview.range();

    yScale.domain(s.map(yOverview.invert, yOverview));

    if (chartDataShape === "multipleDimensions") {
      const barRatio = yOverview.range()[1] / (s[1] - s[0]);
      const multiDimWidth =
        height - margin.top - titleHeights - legendHeight - xAxisHeight;

      // const multiDimWidth = yScale.range()[1];

      barWidth = (multiDimWidth / (data.length + items.length)) * barRatio;

      let noOfItems = 0;
      let paddingItem = -1;

      data.forEach((item, index) => {
        if (paddingItem === item.paddingShift) noOfItems++;
        paddingItem = item.paddingShift;
        item.x =
          barWidth * noOfItems +
          index * barWidth -
          (yScale.domain()[0] / yScale.domain()[1]) *
            yScale.range()[1] *
            barRatio;
      });
    }
    yAxisLableSize.height - (isScrollDisplayed ? marginOverview.bottom : 0);

    // for Single Dimension and multiple measures
    diagram.selectAll(".bars").each(function(item, i, node) {
      node[i].transform.baseVal[0].matrix.f = titleHeights;
    });
    diagram.selectAll(".bar-labels").each(function(item, i, node) {
      node[i].transform.baseVal[0].matrix.f =
        chartDataShape === "singleDimensionMeasure"
          ? titleHeights + padding
          : titleHeights;
    });
    diagram.selectAll(".bar-group").each(function(item, i, node) {
      node[i].transform.baseVal[0].matrix.f = yScale(i);
    });
    diagram.selectAll(".bar-group-labels").each(function(item, i, node) {
      node[i].transform.baseVal[0].matrix.f = yScale(i) + barWidth / 2;
    });

    const rects = diagram.selectAll("rect");
    rects.attr("height", barWidth).attr("y", (d, i) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
          return yScale(i) + padding;
        case "stackedChart":
        case "percentStacked":
          return yScale(d.dimIndex) + padding;
        case "singleDimension":
          return (i % qMeasureCount) * barWidth + padding;
        case "multipleDimensions":
          return d.x;
      }
    });

    const labels = diagram.selectAll(".bar-label-text");

    labels.attr("y", (d, i) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "stackedChart":
        case "percentStacked":
          return yScale(i) + barWidth / 2;
        case "singleDimension":
          return (i % qMeasureCount) * barWidth + padding;
        case "multipleDimensions":
          return d.x + barWidth / 2;
      }
    });
    // .attr('dominant-baseline', 'central');

    diagram
      .select(".y.axis")
      .selectAll(".tick")
      .attr("transform", (d, i) => {
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "stackedChart":
          case "percentStacked":
            // return `translate(0,${yScale(i) + barWidth / 2 + padding})`;
            return `translate(0,${yScale(i) + barWidth})`;
          case "multipleDimensions":
            return `translate(0,${yScale(i) +
              (barWidth / 2) * qMeasureCount +
              padding})`;
          case "singleDimension":
            return `translate(0,${yScale(i) +
              (barWidth / 2) * qMeasureCount +
              barWidth / 2 +
              padding})`;
        }
      });

    shiftYAxis();
  }
}
