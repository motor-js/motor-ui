// https://core.qlik.com/services/qix-engine/apis/qix/definitions/#fieldattributes
// qNumFormat use for Legend in qLayout qMeasureInfo
// https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript/

// Time formatting d3
// http://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
// http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e

// Animation
//medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61

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
  stackHyperCubeData,
  colorByExpression,
} from "../../../utils";

export default function createLine({
  qLayout,
  qData,
  // chartWidth,
  chartHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionLineVisible,
  // buildSelections,
  selections,
  select,
  title,
  subTitle,
  showLegend,
  allowSelections,
  showAxis,
  maxAxisLength,
  LineThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  areaChart,
  stacked,
  dualAxis,
  showLabels,
  allowZoom,
  suppressScroll,
  scrollRatio,
  textOnAxis,
  tickSpacing,
  curve,
  symbol,
  showGridlines,
} = chartSettings) {
  const { qDimensionInfo, qMeasureInfo } = qLayout.qHyperCube;
  const { qMatrix } = qData;
  const qDimensionCount = qDimensionInfo.length;
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

  let markerShape = null;

  switch (symbol) {
    case "circle":
      markerShape = d3.symbolCircle;
      break;
    case "cross":
      markerShape = d3.symbolCross;
      break;
    case "diamond":
      markerShape = d3.symbolDiamond;
      break;
    case "square":
      markerShape = d3.symbolSquare;
      break;
    case "star":
      markerShape = d3.symbolStar;
      break;
    case "triangle":
      markerShape = d3.symbolTriangle;
      break;
    case "wye":
      markerShape = d3.symbolWye;
      break;
    default:
      markerShape = d3.symbolCircle;
  }

  const {
    LineChartStyle,
    LineDefault,
    LineStyle,
    // LineMarkerStyle,
    GridLineStyle,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    LineLabelStyle,
    // LineOverviewLine,
    // LineSelectionStyle,
    SelectedMarker,
    NonSelectedMarker,
    colorPalette,
  } = LineThemes;

  const chartDataShape =
    qDimensionInfo.length === 1 && qMeasureInfo.length === 2 && dualAxis
      ? "dualAxis"
      : qDimensionInfo.length === 1 && qMeasureInfo.length === 1
      ? "singleDimensionMeasure"
      : qDimensionInfo.length == 1
      ? "singleDimension"
      : "multipleDimensions";

  const dualAxisChart = chartDataShape === "dualAxis" ? true : false;

  let pendingSelections = [];

  const uuid = uuidv4();

  let height;
  let height2;
  const delayMilliseconds = 1500;
  const selectorHeight = 70;
  let titleHeights = 0;
  let xAxisHeight = 0;
  let longAxisLabels = false;

  // Check if width is % or number in px
  // let width = /^\d+(\.\d+)?%$/.test(chartWidth)
  //   ? (+parseInt(chartWidth, 10) / 100) * screenWidth
  //   : +parseInt(chartWidth, 10);
  let width = screenWidth;

  // Check if height is % or number in px
  const heightValue = /^\d+(\.\d+)?%$/.test(chartHeight)
    ? (+parseInt(chartHeight, 10) / 100) * window.innerHeight
    : +parseInt(chartHeight, 10);

  const margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 50,
  };

  if (["both", "yAxis"].some((substring) => textOnAxis.includes(substring)))
    margin.left += 10;
  if (
    qMeasureInfo[0].qNumFormat.qType !== "U" &&
    qMeasureInfo[0].qNumFormat.qFmt.includes("%")
  )
    margin.left += 20;

  const margin2 = {
    top: +parseInt(heightValue, 10) - selectorHeight,
    right: 10,
    bottom: 20,
    left: margin.left,
  };

  const formatValue = (val, precision, sign) => {
    let formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  const drawLineLabels = () => {
    const labels = Line_chart.append("g")
      .attr("class", "line-labels")
      .selectAll(`.label-${focusLineIndex}`)
      .data(data, (d) => d[Object.keys(d)[0]])
      .enter()
      .append("text")
      .attr("transform", `translate(0,${titleHeights})`)
      .attr("class", `label-${focusLineIndex}`) // Assign a class for styling
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => {
        return chartType === "DISCRETE"
          ? categories
            ? x(parseInt(i / categories.length))
            : x(i)
          : x(d[Object.keys(d)[0]]);
      })
      .attr(
        "y",
        (d) =>
          height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight
      )
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)
      .text((d, i) => {
        return qMeasureInfo[focusLineIndex].qNumFormat.qType === "U" ||
          qMeasureInfo[focusLineIndex].qNumFormat.qFmt === "##############" ||
          qMeasureInfo[focusLineIndex].qNumFormat.qFmt === "########" ||
          qMeasureInfo[focusLineIndex].qNumFormat.qFmt === "###0"
          ? formatValue(d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]])
          : qMatrix[i][qDimensionCount + focusLineIndex].qText;
      })
      .attr("y", (d) => {
        if (dualAxisChart) {
          if (focusLineIndex == 0) {
            return yScale(d[Object.keys(d)[qDimensionCount * 2]]);
          } else {
            return yScaleR(d[Object.keys(d)[qDimensionCount * 2 + 1]]);
          }
        } else {
          return yScale(
            d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
          );
        }
      })
      .attr("dy", "-.7em");

    setStyle(labels, LineLabelStyle);
  };

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(
    qLayout.qHyperCube,
    qData.qMatrix,
    colorPalette
  );

  const markerColor = d3.scaleOrdinal(conditionalColors); // color for markers
  const color = d3.scaleOrdinal(colorPalette); // color for lines

  d3.select(d3Container.current)
    .select("svg")
    .remove();

  const svg = d3
    .select(d3Container.current)
    .append("svg")
    .attr("width", width)
    .attr("height", heightValue);

  setStyle(svg, LineChartStyle);

  const DimensionInfo = qDimensionInfo[0];

  let qDataSet = hyperCubeTransform(
    qData,
    qLayout.qHyperCube,
    (DimensionInfo.qDimensionType === "N" &&
      DimensionInfo.qMax.toString().length === 4) ||
      DimensionInfo.qMax.toString().length === 5
  );

  let rangeBands = getMeasureNames(qLayout.qHyperCube);

  if (stacked) {
    [qDataSet, rangeBands] = stackHyperCubeData(qDataSet, false);
  }

  let data = qDataSet;

  const getDimensionCategories = (data, fieldNo) => [
    ...new Set(data.map((d) => d[Object.keys(d)[fieldNo]])),
  ];

  let categories =
    chartDataShape === "multipleDimensions"
      ? getDimensionCategories(data, 2)
      : null;

  const bands = getDimensionCategories(data, 0);

  if (stacked) categories = rangeBands;

  const showScroll =
    !(suppressScroll || LineDefault.suppressScroll) || scrollRatio;

  const isScrollDisplayed =
    (showScroll && bands.length >= LineDefault.dataPointsToShow) ||
    (showScroll && scrollRatio);

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

  width = width - legendWidth - 10;

  // Convert a 5 digit number to a date
  function SerialDateToJSDate(serialDate) {
    var days = Math.floor(serialDate);
    var hours = Math.floor((serialDate % 1) * 24);
    var minutes = Math.floor(((serialDate % 1) * 24 - hours) * 60);
    return new Date(Date.UTC(0, 0, serialDate, hours - 17, minutes));
  }

  // Convert a 4 digit number to a date
  const convertDate = (d) => new Date(`${d}-01-01`);

  const formatDimToolTip = (val) => {
    switch (chartType) {
      case "YearDate":
        // Formatting for 4 digit number in tooltip
        return val.getFullYear();
      case "numDate":
        // Formatting tooltip date to local Date.
        return val.toLocaleString().split(",")[0];
      default:
        return val;
    }
  };

  let chartType = "DISCRETE";
  let x = d3.scaleLinear();
  let x2 = d3.scaleLinear();

  if (
    DimensionInfo.qDimensionType === "N" &&
    DimensionInfo.qMax.toString().length === 4
  ) {
    chartType = "YearDate";
    x = d3.scaleTime();
    x2 = d3.scaleTime();
    qDataSet.map(
      (d) => (d[Object.keys(d)[0]] = convertDate(d[Object.keys(d)[0]]))
    );
  } else if (
    DimensionInfo.qDimensionType === "N" &&
    DimensionInfo.qMax.toString().length === 5
  ) {
    chartType = "numDate";
    x = d3.scaleTime();
    x2 = d3.scaleTime();
    qDataSet.map((d) => {
      return (d[Object.keys(d)[0]] = SerialDateToJSDate(d[Object.keys(d)[0]]));
    });
  }

  let qMax = null;
  let qMaxRight = null;
  let qMin = null;
  let qMinRight = null;

  if (stacked) {
    qMax = Math.max(
      0,
      d3.max(data, function(d) {
        return +d.total;
      })
    );
    qMin = Math.min(
      0,
      d3.min(data, function(d) {
        return +d.total;
      })
    );
  } else if (dualAxisChart) {
    qMax = Math.max(
      0,
      d3.max(data.map((d) => d[Object.keys(d)[qDimensionCount * 2]]))
    );
    qMaxRight = Math.max(
      0,
      d3.max(data.map((d) => d[Object.keys(d)[qDimensionCount * 2 + 1]]))
    );
    qMin = Math.min(
      0,
      d3.min(data.map((d) => d[Object.keys(d)[qDimensionCount * 2]]))
    );
    qMinRight = Math.min(
      0,
      d3.min(data.map((d) => d[Object.keys(d)[qDimensionCount * 2 + 1]]))
    );
  } else {
    const valuesMax = [];
    const valuesMin = [];
    qMeasureInfo.forEach((measure, i) => {
      const items = data.map((d) => d[Object.keys(d)[qDimensionCount * 2 + i]]);
      valuesMax.push(d3.max(items));
      valuesMin.push(d3.min(items));
    });

    qMax = Math.max(0, d3.max(valuesMax));
    qMin = Math.min(0, d3.min(valuesMin));
  }

  let rightAxisWidth = 0;

  if (dualAxisChart) {
    const sampleText = svg
      .selectAll(".sampleText")
      .data([qMaxRight])
      .enter()
      .append("text")
      .text((d) => d);

    const numFormat = qMeasureInfo[1].qNumFormat;
    const decimals =
      qMeasureInfo[1].qNumFormat.qFmt &&
      qMeasureInfo[1].qNumFormat.qFmt.includes("%")
        ? `,.${
            numFormat.qFmt.slice(
              numFormat.qFmt.indexOf(numFormat.qDec) + 1,
              numFormat.qFmt.indexOf("%")
            ).length
          }%`
        : 0;

    const newValue =
      qMeasureInfo[1].qNumFormat.qType !== "U" &&
      qMeasureInfo[1].qNumFormat.qFmt.includes("%")
        ? d3.format(decimals)(sampleText.text().replace(/,/g, ""))
        : formatValue(parseFloat(sampleText.text().replace(/,/g, "")), true);
    sampleText.text(newValue);

    rightAxisWidth = sampleText.node().getBBox().width;

    sampleText.remove();
  }

  const textOnAxisSpacing =
    ["both", "yAxis"].some((substring) => textOnAxis.includes(substring)) &&
    dualAxisChart
      ? 25
      : 0;

  x.range([
    0,
    width -
      margin.left -
      margin.right -
      rightAxisWidth -
      textOnAxisSpacing -
      legendLeftPadding,
  ]);

  x2.range(x.range());
  var yScale = d3.scaleLinear().range([height, 0]);
  var yScaleR = d3.scaleLinear().range([height, 0]); //Right Y Axis
  let yOverview = d3.scaleLinear().range([height2, 0]);
  let yOverviewR = d3.scaleLinear().range([height2, 0]);

  const xAxis = d3.axisBottom(x);

  const xAxis2 = d3
    .axisBottom(x2)
    .tickValues([])
    .tickSize([]);

  let focusLineIndex = 0;

  const line = d3
    .line()
    .x((d, i) => (chartType === "DISCRETE" ? x(i) : x(d[Object.keys(d)[0]])))
    .y((d) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "singleDimension":
          return yScale(
            d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
          );
        case "multipleDimensions":
          return yScale(+d[Object.keys(d)[4]]);
        case "dualAxis":
          return yScale(d[Object.keys(d)[qDimensionCount * 2]]);
      }
    })
    .curve(d3[`curve${curve}`]);

  const lineR = d3
    .line()
    .x((d, i) => (chartType === "DISCRETE" ? x(i) : x(d[Object.keys(d)[0]])))
    .y((d) => yScaleR(d[Object.keys(d)[qDimensionCount * 2 + 1]]))
    .curve(d3[`curve${curve}`]);

  const line2 = d3
    .line()
    // .x((d) => x2(d[Object.keys(d)[0]]))
    .x((d, i) => (chartType === "DISCRETE" ? x2(i) : x2(d[Object.keys(d)[0]])))
    .y((d) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "singleDimension":
          return (
            yOverview(d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]) -
            legendHeight
          );
        case "multipleDimensions":
          return yOverview(+d[Object.keys(d)[4]]) - legendHeight;
        case "dualAxis":
          return (
            yOverview(d[Object.keys(d)[qDimensionCount * 2]]) - legendHeight
          );
      }
    })
    .curve(d3[`curve${curve}`]);

  const line2R = d3
    .line()
    .x((d, i) => (chartType === "DISCRETE" ? x2(i) : x2(d[Object.keys(d)[0]])))
    .y(
      (d) =>
        yOverviewR(d[Object.keys(d)[qDimensionCount * 2 + 1]]) - legendHeight
    )
    .curve(d3[`curve${curve}`]);

  var Line_chart = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null);

  const focus = svg
    .append("g")
    .attr("class", "focus-svg")
    .attr("transform", `translate(${margin.left},${margin.top})`);

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

  let multiDimData = null;

  if (stacked) {
    multiDimData = d3.stack().keys(rangeBands)(data);
  } else {
    // Nest the entries by symbol
    multiDimData = d3
      .nest()
      .key((d) => d[Object.keys(d)[qDimensionCount]])
      .entries(data);
  }

  if (chartType === "DISCRETE") {
    x.domain([0, bands.length - 1]);
    xAxis.ticks(bands.length);
  } else {
    x.domain(d3.extent(data, (d) => d[Object.keys(d)[0]]));
  }

  x2.domain(x.domain());
  yOverview.domain(yScale.domain());
  yOverviewR.domain(yScaleR.domain());

  function long_string(arr) {
    let longest = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].length > longest.length) {
        longest = arr[i];
      }
    }
    return longest;
  }

  function calcXAxisLabelHeight() {
    let itemWidths = [];

    const newItem = svg.append("g");

    let longest = "";
    let longestLength = 0;

    const container = newItem
      .append("text")
      .attr("y", 0)
      .attr("dy", 0)
      .text(longest);

    bands.map((d) => {
      container.text(d);

      if (newItem.node().getBBox().width > longestLength) {
        longest = d;
        longestLength = newItem.node().getBBox().width;
      }
    });

    container.text(longest);

    if (x(1) >= newItem.width) {
      return;
    }
    if (chartType !== "DISCRETE") {
      xAxisHeight = newItem.node().getBBox().height;
      return;
    }
    newItem.attr("transform", "translate(0,2) rotate(-45)");

    longAxisLabels = true;
    do {
      longest = longest.substring(0, longest.length - 1);

      container.text(longest + "...");
    } while (newItem.node().getBBox().width > maxAxisLength);

    xAxisHeight = newItem.node().getBBox().width;

    newItem.remove();
  }

  calcXAxisLabelHeight();

  function redrawXAxis() {
    let itemWidths = [];

    let ticks = focus.select(".axis--x").selectAll("g.tick");
    ticks.each(function(i) {
      const self = d3.select(this);
      self.select("text").text(bands[i]);
      itemWidths.push(self.node().getBBox().width);
    });

    if (x(1) < d3.max(itemWidths)) {
      const xAxisLabels = focus
        .select(".axis--x")
        .selectAll("text")
        .attr("dy", ".35em")
        .attr("transform", "translate(0,2) rotate(-45)")
        .style("text-anchor", "end");

      if (longAxisLabels) {
        xAxisLabels.each(function(i) {
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
    }
  }

  function cleanXAxis() {
    do {
      let endPos = null;

      const xAxisLabels = focus.select(".axis--x").selectAll(".tick");
      const noOfTicks = xAxisLabels._groups[0].length;

      if (noOfTicks === 0) return false;

      var overlapFlag = false;

      xAxisLabels.each(function(d, i) {
        const self = d3.select(this);
        const currentPos = self.node().transform.baseVal[0].matrix.e;
        if (i == 0) {
          endPos = currentPos + this.getBoundingClientRect().width;
        } else {
          if (currentPos < endPos) overlapFlag = true;

          if (overlapFlag) {
            noOfTicks--;

            xAxis.ticks(noOfTicks--);
            focus.select(".axis--x").call(xAxis);
            overlapFlag = false;
            return true;
          }
          endPos = currentPos + this.getBoundingClientRect().width + 5;
          if (overlapFlag) return true;
        }
      });
    } while (overlapFlag);
  }

  function setHeight() {
    if (isScrollDisplayed) {
      height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
      height2 = +parseInt(heightValue, 10) - margin2.top - margin2.bottom;
    } else {
      margin.bottom = margin2.bottom;
      height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
    }

    svg.attr("height", height + margin.top + margin.bottom);

    let textHeight = 0;

    if (showLabels !== "none") {
      const textValue = formatValue(qMax);

      const sampleText = svg
        .selectAll(".sampleText")
        .data([textValue])
        .enter()
        .append("text")
        .text((d) => d);

      textHeight = sampleText.node().getBBox().height;

      sampleText.remove();
    }

    titleHeights =
      titleHeight + subTitleHeight ||
      `${parseInt(
        textHeight +
          margin.top +
          // xAxisHeight +
          (isScrollDisplayed ? margin2.bottom : 0)
      )}`;

    // Reduce top margin if Titles take up much space.
    titleHeights =
      titleHeights /
        (height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight) >
      1
        ? (titleHeights -= margin.top / 2)
        : titleHeights;

    titleHeights = titleHeights > 0 ? titleHeights - margin.top : titleHeights;

    yScale = d3
      .scaleLinear()
      .range([
        height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight,
        0,
      ]);

    yScaleR = d3
      .scaleLinear()
      .range([
        height - titleHeights - xAxisHeight - xAxisTextHeight - legendHeight,
        0,
      ]);
  }

  let xAxisTextHeight = 0;
  let xAxisText = null;

  if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
    // text label for the x axis
    xAxisText = focus
      .append("text")
      .style("text-anchor", "middle")
      .text(qDimensionInfo[0].qFallbackTitle);

    setStyle(xAxisText, axisTitleStyle);

    xAxisTextHeight = xAxisText.node().getBBox().height + (showScroll ? 10 : 0);
  }

  setHeight();

  if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
    xAxisText.attr(
      "transform",
      `translate(${width / 2} ,${height +
        margin.top -
        legendHeight +
        (isScrollDisplayed ? 5 : 0)})`
    );
  }

  function createYAxis(data) {
    yScale.domain([qMin, qMax]);
    yScaleR.domain([qMinRight, qMaxRight]);

    const yAxis = d3.axisLeft(yScale);
    const yAxisR = d3.axisRight(yScaleR);

    yOverview = d3.scaleLinear().range([height2, 0]);

    yOverview.domain([qMin, qMax]);
    yOverviewR = d3.scaleLinear().range([height2, 0]);

    yOverviewR.domain([qMinRight, qMaxRight]);

    switch (tickSpacing) {
      case "wide":
        yAxis.ticks(yScale.ticks().length * 0.5);
        yAxisR.ticks(yScaleR.ticks().length * 0.5);
        break;
      case "normal":
        break;
      case "narrow":
        yAxis.ticks(yScale.ticks().length * 1.5);
        yAxisR.ticks(yScaleR.ticks().length * 1.5);
        break;
    }

    const yax = focus
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(0,${titleHeights})`);

    yax.call(yAxis);

    setStyle(yax, yAxisStyle);

    if (["none", "xAxis"].some((substring) => showAxis.includes(substring))) {
      yax.select(".domain").remove();

      yax
        .selectAll("g.tick")
        .selectAll("line")
        .remove();
    }

    yax.selectAll("g.tick").each(function(i) {
      const textItem = d3.select(this).select("text");

      const numFormat = qMeasureInfo[0].qNumFormat;
      let decimals = 0;

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

      const newValue =
        qMeasureInfo[0].qNumFormat.qType !== "U" &&
        qMeasureInfo[0].qNumFormat.qFmt.includes("%")
          ? d3.format(decimals)(textItem.text().replace(/,/g, ""))
          : formatValue(parseFloat(textItem.text().replace(/,/g, "")), true);

      textItem.text(newValue);
    });

    if (dualAxisChart) {
      // Get the width of the values on the right Y axis
      const yaxR = focus
        .append("g")
        .attr("class", "y axisR")
        .attr("transform", `translate(${x.range()[1]},${titleHeights})`);

      yaxR.call(yAxisR);

      setStyle(yaxR, yAxisStyle);

      if (["none", "xAxis"].some((substring) => showAxis.includes(substring))) {
        yaxR.select(".domain").remove();

        yaxR
          .selectAll(".tick")
          .selectAll("line")
          .remove();
      }

      yaxR.selectAll("g.tick").each(function(i, a, b) {
        const self = d3.select(this);
        const textItem = self.select("text");

        const numFormat = qMeasureInfo[1].qNumFormat;
        let decimals = 0;
        if (
          qMeasureInfo[1].qNumFormat.qType !== "U" &&
          qMeasureInfo[1].qNumFormat.qFmt.includes("%")
        ) {
          decimals = `,.${
            numFormat.qFmt.slice(
              numFormat.qFmt.indexOf(numFormat.qDec) + 1,
              numFormat.qFmt.indexOf("%")
            ).length
          }%`;
        }

        const newValue =
          qMeasureInfo[1].qNumFormat.qType !== "U" &&
          qMeasureInfo[1].qNumFormat.qFmt.includes("%")
            ? d3.format(decimals)(textItem.text().replace(/,/g, ""))
            : formatValue(parseFloat(textItem.text().replace(/,/g, "")), true);

        textItem.text(newValue);
      });
    }

    if (["both", "yAxis"].some((substring) => textOnAxis.includes(substring))) {
      // text label for the y axis
      const yAxisText = focus
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr(
          "x",
          0 -
            (height -
              xAxisHeight +
              titleHeights -
              // xAxisTextHeight -
              legendHeight) /
              2
        )
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(
          dualAxisChart
            ? qMeasureInfo[0].qFallbackTitle
            : qMeasureInfo.map((measure) => measure.qFallbackTitle).join(", ")
        );

      setStyle(yAxisText, axisTitleStyle);
      if (dualAxisChart) {
        const yAxisTextRight = focus
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", `${x.range()[1] + rightAxisWidth + 20}`)
          .attr(
            "x",
            0 -
              (height -
                xAxisHeight +
                titleHeights -
                // xAxisTextHeight -
                legendHeight) /
                2
          )
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(qMeasureInfo[1].qFallbackTitle);

        setStyle(yAxisTextRight, axisTitleStyle);
      }
    }

    if (
      ["solid", "dashes", "dots", "default"].some((substring) =>
        showGridlines.includes(substring)
      )
    ) {
      // Y Gridline
      const gridlines = d3
        .axisLeft()
        .tickFormat("")
        .tickSize(-x.range()[1])
        .scale(yScale);

      switch (tickSpacing) {
        case "wide":
          gridlines.ticks(yScale.ticks().length * 0.5);
          break;
        case "normal":
          break;
        case "narrow":
          gridlines.ticks(yScale.ticks().length * 1.5);
          break;
      }

      const y_gridlines = Line_chart.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${titleHeights})`)
        .call(gridlines);
      // .selectAll('.domain').remove();

      setStyle(y_gridlines.selectAll("g.tick line"), GridLineStyle);
      setStyle(y_gridlines.selectAll(".domain"), GridLineStyle);

      switch (showGridlines) {
        case "dashes":
          y_gridlines.style("stroke-dasharray", "13, 13");
          break;
        case "solid":
          y_gridlines.style("stroke-dasharray", "0, 0");
          break;
        case "dots":
          y_gridlines.style("stroke-dasharray", "3,3");
          break;
        case "default":
          setStyle(y_gridlines.selectAll("g.tick line"), GridLineStyle);
          setStyle(y_gridlines.selectAll(".domain"), GridLineStyle);
          break;
      }
      y_gridlines.selectAll(".domain").remove();
    }
  }
  createYAxis(data);

  const area = d3
    .area()
    .x((d, i) => (chartType === "DISCRETE" ? x(i) : x(d[Object.keys(d)[0]])))
    .y0(yScale(0))
    .y1((d) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "singleDimension":
          return yScale(
            d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
          );
        case "multipleDimensions":
          return yScale(+d[Object.keys(d)[4]]);
        case "dualAxis":
          return yScale(d[Object.keys(d)[qDimensionCount * 2]]);
      }
    });

  const areaR = d3
    .area()
    .x((d, i) => (chartType === "DISCRETE" ? x(i) : x(d[Object.keys(d)[0]])))
    .y0(yScaleR(0))
    .y1((d) => yScaleR(d[Object.keys(d)[qDimensionCount * 2 + 1]]));

  const stackedArea = d3
    .area()
    .x((d, i) => {
      return chartType === "DISCRETE"
        ? x(i)
        : x(d.data[Object.keys(d.data)[0]]);
    })
    // .x((d, i) => (chartType === "DISCRETE" ? x(i) : x(d[Object.keys(d)[0]])))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const stackedArea2 = d3
    .area()
    // .x((d) => x(d.data[Object.keys(d.data)[0]]))
    .x((d, i) =>
      chartType === "DISCRETE" ? x(i) : x(d.data[Object.keys(d.data)[0]])
    )
    .y0((d) => yOverview(d[0]))
    .y1((d) => yOverview(d[1]));

  focus
    .append("g")
    .attr("class", "axis axis--x")
    .attr(
      "transform",
      `translate(0,${height - xAxisHeight - xAxisTextHeight - legendHeight})`
    )
    .call(xAxis);

  if (["none", "yAxis"].some((substring) => showAxis.includes(substring))) {
    focus
      .select(".axis--x")
      .select(".domain")
      .remove();

    focus
      .select(".axis--x")
      .selectAll(".tick")
      .selectAll("line")
      .remove();
  }

  if (chartType === "DISCRETE") redrawXAxis();

  // setXAxisInteractivity(focus);
  setStyle(focus.select(".axis--x"), xAxisStyle);

  if (chartType !== "DISCRETE") cleanXAxis();

  const area2 = d3
    .area()
    .x((d) => x2(d[Object.keys(d)[0]]))
    .y0(yOverview(0))
    .y1((d) => {
      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "singleDimension":
          return (
            yOverview(d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]) -
            legendHeight
          );
        case "multipleDimensions":
          return yOverview(+d[Object.keys(d)[4]]) - legendHeight;
        case "dualAxis":
          yOverview(d[Object.keys(d)[qDimensionCount * 2]]) - legendHeight;
      }
    });

  const area2R = d3
    .area()
    .x((d) => x2(d[Object.keys(d)[0]]))
    .y0(yOverview(0))
    .y1((d) => {
      yOverview(d[Object.keys(d)[qDimensionCount * 2 + 1]]) - legendHeight;
    });

  const setLineColors = (focus) => {
    // const { selectionBackground, nonSelectionBackground } = LineSelectionStyle;

    const circles = Line_chart.selectAll(".marker");

    circles.each(function(d, i) {
      const self = d3.select(this);
      self.style("fill", (d, index, node) => {
        const elemNumber = stacked ? d.data.elemNumber : d.elemNumber;

        if (
          stacked ||
          chartDataShape === "singleDimension" ||
          chartDataShape === "dualAxis"
        ) {
          if (pendingSelections.includes(elemNumber)) {
            setStyle(self, SelectedMarker);
            return conditionalColors.length === 0
              ? color(node[0].dataset.legend)
              : markerColor(i);
          } else {
            return NonSelectedMarker.backgroundColor;
          }
        } else {
          if (
            chartDataShape === "multipleDimensions" &&
            pendingSelections.includes(elemNumber)
          ) {
            setStyle(self, SelectedMarker);
            return conditionalColors.length === 0
              ? color(d[Object.keys(d)[qDimensionCount]])
              : markerColor(i);
          } else if (pendingSelections.includes(elemNumber)) {
            setStyle(self, SelectedMarker);
            return conditionalColors.length === 0
              ? color(rangeBands[focusLineIndex])
              : markerColor(i);
          } else {
            return NonSelectedMarker.backgroundColor;
          }
        }
      });
    });
  };

  function handleClick(d, i, n) {
    const elements = [...new Set(data.map((d, i) => d[Object.keys(d)[1]]))];

    let dataElemNumber = null;
    let xAxisElemNumber = null;

    if (
      chartType !== "DISCRETE" &&
      typeof d.elemNumber === "undefined" &&
      !stacked
    ) {
      dataElemNumber = data.filter((item) => {
        return item[Object.keys(item)[0]].toDateString() === d.toDateString();
      });
      xAxisElemNumber = dataElemNumber[0].elemNumber;
    }

    const index = chartType === "DISCRETE" ? d : i;

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];

    const selectionValue =
      xAxisElemNumber || elements[index] || d[Object.keys(d)[1]] || 0;

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      pendingSelections = updateList;
    } else {
      pendingSelections = [...pendingSelections, selectionValue];
    }
    setLineColors(focus);

    beginSelections();

    setSelectionLineVisible(true);

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
        select(0, [selectionValue]);
      } else {
        select(
          0,
          itemsSelected.filter((e) => e !== selectionValue)
        );
      }
    } else {
      select(0, [selectionValue]);
    }

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

    /*
    const cursorLocation = [
      this.transform.baseVal[0].matrix.e,
      this.transform.baseVal[0].matrix.f,
    ]
*/

    const cursorLocation = [d3.event.layerX + 5, d3.event.layerY + 10];
    let data = {};

    switch (chartDataShape) {
      case "singleDimensionMeasure":
        data = {
          key: formatDimToolTip(d[Object.keys(d)[0]]),

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
      case "dualAxis":
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
          key: formatDimToolTip(d[Object.keys(d)[0]]),
          value: `${d3.select(this).attr("data-legend")} : ${toolTipValue}`,
        };
        break;
      case "multipleDimensions":
        const key = stacked
          ? formatDimToolTip(d.data[Object.keys(d.data)[0]])
          : formatDimToolTip(d[Object.keys(d)[0]]);

        const legendItem = stacked
          ? d3.select(this).attr("data-legend")
          : d[Object.keys(d)[2]];

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

  function setXAxisInteractivity() {
    focus
      .selectAll(".axis--x .tick")
      .on("click", allowSelections ? handleClick : null)
      .on("mouseover", handleMouseOver);
  }

  qMeasureInfo.forEach((measure, i) => {
    focusLineIndex = i;
    let lines = null;

    switch (chartDataShape) {
      case "singleDimensionMeasure":
      case "singleDimension":
        lines = Line_chart.append("path")
          .attr("transform", `translate(0,${titleHeights})`)
          .datum(data)
          .attr("class", `line-${focusLineIndex}`)
          .attr("data-legend", rangeBands[focusLineIndex])
          .attr("d", areaChart ? area : line);

        setStyle(lines, {
          ...LineStyle,
          stroke: color(rangeBands[focusLineIndex]),
          fill: areaChart ? color(rangeBands[focusLineIndex]) : "none",
        });
        break;
      case "dualAxis":
        // case 'singleDimension':
        lines = Line_chart.append("path")
          .attr("transform", `translate(0,${titleHeights})`)
          .datum(data)
          .attr("class", `line-${focusLineIndex}`)
          .attr("data-legend", rangeBands[focusLineIndex])
          .attr(
            "d",
            areaChart ? (i === 0 ? area : areaR) : i === 0 ? line : lineR
          );

        setStyle(lines, {
          ...LineStyle,
          stroke: color(rangeBands[focusLineIndex]),
          fill: areaChart ? color(rangeBands[focusLineIndex]) : "none",
        });
        break;
      case "multipleDimensions":
        // Loop through each symbol / key
        multiDimData.forEach((item, index) => {
          lines = Line_chart.append("path")
            .attr("transform", `translate(0,${titleHeights})`)
            .attr("class", `line-${index}`)
            .attr("data-legend", categories[index])
            .attr(
              "d",
              stacked
                ? stackedArea(item)
                : areaChart
                ? area(item.values)
                : line(item.values)
            );

          setStyle(lines, {
            ...LineStyle,
            stroke: color(categories[index]),
            fill: areaChart ? color(categories[index]) : "none",
          });
        });

        break;
    }

    if (stacked) {
      let labels = null;
      if (symbol !== "none") {
        multiDimData.forEach((s, i) => {
          Line_chart.selectAll(`.dot-${i}`)
            .data(s)
            .enter()
            .append("path") // Uses the enter().append() method
            .attr("class", `dot-${i} marker`) // Assign a class for styling
            .attr(
              "fill",
              conditionalColors.length === 0 ? color(categories[i]) : color(i)
            )
            .attr("stroke", color(categories[i]))
            .attr("data-legend", s.key)
            .attr("data-value", (d, index) => s[index].data[s.key])
            .attr("d", d3.symbol().type(markerShape))
            .attr("transform", function(d, i) {
              const xValue =
                chartType === "DISCRETE"
                  ? x(i)
                  : x(d.data[Object.keys(d.data)[0]]);

              // let yValue = titleHeights + yScale(d[1]);
              let yValue = titleHeights + yScale(d[0]);
              return "translate(" + xValue + "," + yValue + ")";
            })
            .on("mousemove", handleMouseMove)
            .on("click", allowSelections ? handleClick : null)
            .on("mouseout", handleMouseOut)
            .on("mouseover", handleMouseOver);
        });
      }
      if (showLabels !== "none") {
        multiDimData.forEach((s, i) => {
          labels = Line_chart.append("g")
            .attr("class", "line-labels")
            .selectAll(`.label-${i}`)
            .data(s)
            .enter()
            .append("text")
            .attr("transform", `translate(0,${titleHeights})`)
            .attr("class", `label-${i}`) // Assign a class for styling
            .attr("text-anchor", "middle")
            .attr("x", (d, i) => {
              // return chartType === "DISCRETE"
              //   ? categories
              //     ? x(parseInt(i / categories.length))
              //     : x(i)
              //   : x(d.data[Object.keys(d.data)[0]]);
              return chartType === "DISCRETE"
                ? x(i)
                : x(d.data[Object.keys(d.data)[0]]);
            })
            .attr(
              "y",
              (d) =>
                height -
                titleHeights -
                xAxisHeight -
                xAxisTextHeight -
                legendHeight
            )
            .attr("height", 0)
            .transition()
            .duration(750)
            .delay((d, i) => delayMilliseconds / qItems)

            .text((d, index) => {
              return qMeasureInfo[0].qNumFormat.qType === "U" ||
                qMeasureInfo[0].qNumFormat.qFmt === "##############" ||
                qMeasureInfo[0].qNumFormat.qFmt === "########" ||
                qMeasureInfo[0].qNumFormat.qFmt === "###0"
                ? formatValue(s[index].data[s.key])
                : qMatrix[index * categories.length + i][qDimensionCount].qText;
            })

            .attr("y", (d) => yScale(d[1]))
            .attr("dy", "-.7em");
          setStyle(labels, LineLabelStyle);
        });
      }
    } else {
      if (symbol !== "none") {
        Line_chart.selectAll(`.dot-${focusLineIndex}`)
          .data(data)
          .enter()
          .append("path") // Uses the enter().append() method
          .attr("class", `dot-${focusLineIndex} marker`) // Assign a class for styling
          .attr("fill", (d, index) => {
            if (conditionalColors.length === 0) {
              return chartDataShape === "multipleDimensions"
                ? color(d[Object.keys(d)[qDimensionCount]])
                : color(rangeBands[focusLineIndex]);
            } else {
              return markerColor(index);
            }
          })
          .attr("stroke", (d, index) => {
            return chartDataShape === "multipleDimensions"
              ? color(d[Object.keys(d)[qDimensionCount]])
              : color(rangeBands[focusLineIndex]);
          })
          .attr(
            "data-value",
            (d, index) =>
              d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
          )
          .attr("data-legend", (d, index) =>
            chartDataShape === "singleDimension" ||
            chartDataShape === "dualAxis"
              ? Object.keys(d)[qDimensionCount * 2 + focusLineIndex]
              : null
          )
          .attr("d", d3.symbol().type(markerShape))
          .attr("transform", function(d, i) {
            const xValue =
              chartType === "DISCRETE"
                ? categories
                  ? x(parseInt(i / categories.length))
                  : x(i)
                : x(d[Object.keys(d)[0]]);

            let yValue = titleHeights;
            if (dualAxisChart) {
              if (focusLineIndex == 0) {
                yValue += yScale(d[Object.keys(d)[qDimensionCount * 2]]);
              } else {
                yValue += yScaleR(d[Object.keys(d)[qDimensionCount * 2 + 1]]);
              }
            } else {
              yValue += yScale(
                d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
              );
            }
            return "translate(" + xValue + "," + yValue + ")";
          })

          .on("mousemove", handleMouseMove)
          .on("click", allowSelections ? handleClick : null)
          .on("mouseout", handleMouseOut)
          .on("mouseover", handleMouseOver);
      }
      if (showLabels !== "none") drawLineLabels();
    }
  });

  if (
    ["both", "xAxis"].some((substring) => showAxis.includes(substring)) &&
    yScale(0) === 0 &&
    !dualAxis
  ) {
    focus
      .append("line")
      .attr("transform", `translate(0,${titleHeights})`)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("x1", 0)
      .attr("x2", x.range()[1])
      .attr("stroke", "black");

    focus
      .select(".axis--x")
      .select(".domain")
      .remove();
  }

  if (isScrollDisplayed) {
    const context = svg
      .append("g")
      .attr("class", "context")
      .attr("transform", `translate(${margin2.left},${margin2.top})`);
    const clip = svg
      .append("defs")
      .append("svg:clipPath")
      // .attr("id", "clip")
      .attr("id", uuid)
      .append("svg:rect")
      // .attr('width', width - margin.right - margin.left)
      .attr("width", x.range()[1])
      .attr("height", heightValue)
      .attr("x", 0)
      .attr("y", 0);

    qMeasureInfo.forEach((measure, i) => {
      focusLineIndex = i;
      let lines = null;

      switch (chartDataShape) {
        case "singleDimensionMeasure":
        case "singleDimension":
          lines = context
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("data-legend", rangeBands[focusLineIndex])
            .attr("d", areaChart ? area2 : line2);

          setStyle(lines, {
            ...LineStyle,
            stroke: color(rangeBands[focusLineIndex]),
            fill: areaChart ? color(rangeBands[focusLineIndex]) : "none",
          });
          break;
        case "dualAxis":
          lines = context
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("data-legend", rangeBands[focusLineIndex])
            .attr(
              "d",
              areaChart ? (i === 0 ? area2 : area2R) : i === 0 ? line2 : line2R
            );

          setStyle(lines, {
            ...LineStyle,
            stroke: color(rangeBands[focusLineIndex]),
            fill: areaChart ? color(rangeBands[focusLineIndex]) : "none",
          });
          break;

        case "multipleDimensions":
          multiDimData.forEach((d, i) => {
            lines = context
              .append("path")
              .attr("class", `line-${i}`)
              .attr("data-legend", categories[i])
              .attr(
                "d",
                stacked
                  ? stackedArea2(d)
                  : areaChart
                  ? area2(d.values)
                  : line2(d.values)
              );

            setStyle(lines, {
              ...LineStyle,
              stroke: color(categories[i]),
              fill: areaChart ? color(categories[i]) : "none",
            });
          });

          break;
      }
    });

    context
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height2 - legendHeight})`)
      .call(xAxis2);

    const brush = d3
      .brushX()
      .extent([
        [0, -legendHeight],
        [x.range()[1], height2 - legendHeight],
      ])
      .on("brush end", brushed);

    const scrollLineRatio =
      scrollRatio ||
      (LineDefault.dataPointsToShow < bands.length
        ? LineDefault.dataPointsToShow / bands.length
        : 1);

    context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      // .call(brush.move, x.range());
      .call(brush.move, [x.range()[0], x.range()[1] * scrollLineRatio]);

    if (allowZoom || LineDefault.allowZoom) {
    } else {
      // removes handle to resize the brush
      context.selectAll(".brush>.handle").remove();
      // removes crosshair cursor
      context.selectAll(".brush>.overlay").remove();
    }

    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
      const s = d3.event.selection || x2.range();
      x.domain(s.map(x2.invert, x2));

      qMeasureInfo.forEach((measure, i) => {
        focusLineIndex = i;
        switch (chartDataShape) {
          case "singleDimensionMeasure":
          case "singleDimension":
            Line_chart.select(`.line-${focusLineIndex}`).attr(
              "d",
              areaChart ? area : line
            );
            break;
          case "dualAxis":
            Line_chart.select(`.line-${focusLineIndex}`).attr(
              "d",
              areaChart ? (i === 0 ? area : areaR) : i === 0 ? line : lineR
            );
            break;
          case "multipleDimensions":
            multiDimData.forEach((d, index) => {
              Line_chart.selectAll(`.line-${index}`).attr(
                "d",
                stacked
                  ? stackedArea(d)
                  : areaChart
                  ? area(d.values)
                  : line(d.values)
              );
            });
        }
        if (stacked) {
          multiDimData.forEach((s, i) => {
            Line_chart.selectAll(`text.label-${i}`).attr("x", (d, i) => {
              return chartType === "DISCRETE"
                ? categories
                  ? x(parseInt(i / categories.length))
                  : x(i)
                : x(d.data[Object.keys(d.data)[0]]);
            });
          });
        } else {
          Line_chart.selectAll(`text.label-${focusLineIndex}`).attr(
            "x",
            (d, i) => {
              return chartType === "DISCRETE"
                ? categories
                  ? x(parseInt(i / categories.length))
                  : x(i)
                : x(d[Object.keys(d)[0]]);
            }
          );
        }

        if (stacked) {
          multiDimData.forEach((s, i) => {
            Line_chart.selectAll(`.dot-${i}`).attr("transform", function(d, i) {
              const xValue =
                chartType === "DISCRETE"
                  ? categories
                    ? x(parseInt(i / categories.length))
                    : x(i)
                  : x(d.data[Object.keys(d.data)[0]]);

              let yValue = titleHeights + yScale(d[1]);
              return "translate(" + xValue + "," + yValue + ")";
            });
          });
        } else {
          Line_chart.selectAll(`.dot-${focusLineIndex}`).attr(
            "transform",
            function(d, i) {
              const xValue =
                chartType === "DISCRETE"
                  ? categories
                    ? x(parseInt(i / categories.length))
                    : x(i)
                  : x(d[Object.keys(d)[0]]);

              let yValue = titleHeights;
              if (dualAxisChart) {
                if (focusLineIndex == 0) {
                  yValue += yScale(d[Object.keys(d)[qDimensionCount * 2]]);
                } else {
                  yValue += yScaleR(d[Object.keys(d)[qDimensionCount * 2 + 1]]);
                }
              } else {
                yValue += yScale(
                  d[Object.keys(d)[qDimensionCount * 2 + focusLineIndex]]
                );
              }
              return "translate(" + xValue + "," + yValue + ")";
            }
          );
        }
      });
      focus.select(".axis--x").call(xAxis);

      if (["none", "yAxis"].some((substring) => showAxis.includes(substring))) {
        focus
          .select(".axis--x")
          .select(".domain")
          .remove();

        focus
          .select(".axis--x")
          .selectAll(".tick")
          .selectAll("line")
          .remove();
      }

      if (
        ["both", "xAxis"].some((substring) => showAxis.includes(substring)) &&
        yScale(0) === 0 &&
        !dualAxis
      ) {
        focus
          .select(".axis--x")
          .select(".domain")
          .remove();

        focus
          .select(".axis--x")
          .selectAll(".tick")
          .selectAll("line")
          .remove();
      }

      if (chartType === "DISCRETE") redrawXAxis();
      if (chartType !== "DISCRETE") cleanXAxis();

      // setXAxisInteractivity(focus);
    }
  }
}
