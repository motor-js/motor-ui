import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";
import {
  hyperCubeTransform,
  getMeasureNames,
  colorByExpression,
} from "../../../utils";

import {
  addTitle,
  addSubTitle,
  addLegend,
  addTooltip,
  showTooltip,
  hideTooltip,
} from "../../D3";

import { setStyle } from "../../D3/Helpers";
import { roundNumber } from "../../../utils";

export default function CreateScatter({
  qLayout,
  qData,
  // chartWidth,
  chartHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionScatterVisible,
  // buildSelections,
  selections,
  select,
  title,
  subTitle,
  showLegend,
  allowSelections,
  showAxis,
  ScatterThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  showLabels,
  allowZoom,
  suppressScroll,
  scrollRatio,
  textOnAxis,
  tickSpacing,
  showGridlines,
} = chartSettings) {
  const { qHyperCube } = qLayout;
  const qDimensionCount = qHyperCube.qDimensionInfo.length;
  const measureStartPosition = qDimensionCount * 2;
  const qMeasures = qHyperCube.qMeasureInfo;
  const qItems = qData.qMatrix.length;

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
    ScatterChartStyle,
    ScatterStyle,
    ScatterMarkerStyle,
    GridLineStyle,
    ScatterDefault,
    yAxisStyle,
    xAxisStyle,
    axisTitleStyle,
    ScatterLabelStyle,
    ScatterOverviewScatter,
    // ScatterSelectionStyle,
    SelectedScatter,
    NonSelectedScatter,
    colorPalette,
  } = ScatterThemes;

  let pendingSelections = [];

  const delayMilliseconds = 1500;
  const selectorHeight = 70;

  let height;
  let heightOverview;

  const uuid = uuidv4();

  // Check if width is % or number in px
  // let width = /^\d+(\.\d+)?%$/.test(chartWidth)
  //   ? (+parseInt(chartWidth, 10) / 100) * screenWidth
  //   : +parseInt(chartWidth, 10);
  let width = screenWidth;

  // Check if height is % or number in px
  const heightValue = /^\d+(\.\d+)?%$/.test(chartHeight)
    ? (+parseInt(chartHeight, 10) / 100) * window.innerHeight
    : +parseInt(chartHeight, 10);

  let margin = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 50,
  };

  if (["both", "yAxis"].some((substring) => textOnAxis.includes(substring)))
    margin.left += 10;

  const marginOverview = {
    top: +parseInt(heightValue, 10) - selectorHeight,
    right: 10,
    bottom: 20,
    left: margin.left,
  };

  const showScroll =
    !(suppressScroll || ScatterDefault.suppressScroll) || scrollRatio;
  const isScrollDisplayed = showScroll || (showScroll && scrollRatio);

  const qDataSet = hyperCubeTransform(qData, qHyperCube);

  const qMax = (index) => qMeasures[index].qMax;
  const qMin = (index) => qMeasures[index].qMin;

  const qMaxX = qMax(0);
  const qMinX = qMin(0);
  const qMaxY = qMax(1);
  const qMinY = qMin(1);

  width = width - margin.left - margin.right;

  d3.select(d3Container.current)
    .select("svg")
    .remove();

  const svg = d3
    .select(d3Container.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", heightValue);

  setStyle(svg, ScatterChartStyle);

  const data = qDataSet;

  const rangeBands = getMeasureNames(qHyperCube);

  const qMaxfull = Math.max(...data.map((d) => d[Object.keys(d)[2]]));

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(
    qLayout.qHyperCube,
    qData.qMatrix,
    colorPalette,
    false
  );

  const color = d3.scaleOrdinal(
    conditionalColors.length !== 0 ? conditionalColors : colorPalette
  );
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

  const legendLeftPadding = legendWidth !== 0 ? margin.right : 0;

  width -= legendWidth;

  if (isScrollDisplayed) {
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", uuid)
      .append("rect")
      .attr("width", width - legendLeftPadding)
      .attr("height", heightValue);
  }

  const padding = 5;

  const xScale = d3
    .scaleLinear()
    .range([0, width - legendLeftPadding - padding * 2])
    .domain(d3.extent([qMinX, qMaxX]));

  const xAxis = d3.axisBottom(xScale).tickSize([]);

  const xOverview = d3
    .scaleLinear()
    .domain(xScale.domain())
    .range(xScale.range());

  const xAxisOverview = d3
    .axisBottom(xOverview)
    .tickValues([])
    .tickSize([]);

  function createYAxis(diagram) {
    yScale.domain([qMinY, qMaxY === 0 ? qMaxfull : qMaxY * 1.05]);

    const yAxis = d3.axisLeft(yScale);

    yOverview = d3.scaleLinear().range([heightOverview, 0]);

    yOverview.domain([qMinY, qMaxY]);

    switch (tickSpacing) {
      case "wide":
        yAxis.ticks(yScale.ticks().length * 0.5);
        break;
      case "normal":
        break;
      case "narrow":
        yAxis.ticks(yScale.ticks().length * 1.5);
        break;
    }

    diagram.selectAll(".y.axis").remove();

    const y = diagram
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(0,${titleHeights})`)
      .call(yAxis);

    setStyle(y, yAxisStyle);

    if (["none", "xAxis"].some((substring) => showAxis.includes(substring))) {
      y.select(".domain").remove();

      y.selectAll("g.tick")
        .selectAll("line")
        .remove();
    }

    const yValues = y.selectAll("g.tick");

    yValues.each(function(i) {
      const self = d3.select(this);
      const textItem = self.select("text");

      const newValue = formatValue(
        parseFloat(textItem.text().replace(/,/g, "")),
        true
      );
      textItem.text(newValue);
    });

    if (["both", "yAxis"].some((substring) => textOnAxis.includes(substring))) {
      // text label for the y axis
      const yAxisText = diagram
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(qHyperCube.qMeasureInfo[1].qFallbackTitle);

      setStyle(yAxisText, axisTitleStyle);
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
        // .tickSize(-(width - margin.right))
        .tickSize(-width)
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

      const y_gridlines = diagram
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${titleHeights})`)
        .call(gridlines);

      const y_gridlines_lines = y_gridlines.selectAll("g.tick line");
      setStyle(y_gridlines_lines, GridLineStyle);

      const y_gridlines_lines_domain = y_gridlines.selectAll(".domain");
      setStyle(y_gridlines_lines_domain, GridLineStyle);

      switch (showGridlines) {
        case "dashes":
          y_gridlines_lines.style("stroke-dasharray", "13, 13");
          y_gridlines_lines_domain.style("stroke-dasharray", "13, 13");
          break;
        case "solid":
          y_gridlines_lines.style("stroke-dasharray", "0,0");
          y_gridlines_lines_domain.style("stroke-dasharray", "0,0");
          break;
          break;
        case "dots":
          y_gridlines_lines.style("stroke-dasharray", "3,3");
          y_gridlines_lines_domain.style("stroke-dasharray", "3,3");
          break;
        case "default":
          setStyle(y_gridlines_lines, GridLineStyle);
          setStyle(y_gridlines_lines_domain, GridLineStyle);
          break;
      }

      y_gridlines_lines_domain.remove();
    }
  }

  const setScatterColors = (diagram) => {
    const circles = diagram.selectAll("circle.dot");
    circles.each(function(x, i) {
      const self = d3.select(this);

      let selected = false;
      self.style("fill", (d, index) => {
        selected = pendingSelections.includes(d.elemNumber);

        return conditionalColors.length === 0
          ? color(d[Object.keys(d)[0]])
          : color(i);
      });
      if (useSelectionColours) {
        selected
          ? setStyle(self, SelectedScatter)
          : setStyle(self, NonSelectedScatter);
      }
    });
  };

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    let dim = d;

    d = d3.select(this).attr("data-parent") || d;

    if (typeof d !== "object") {
      dim = getDimension(d);
    }

    if (typeof d === "number") {
      dim = new_data
        ? new_data[Object.keys(new_data)[d]]
        : data[Object.keys(data)[d]];
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

    setScatterColors(diagram);

    beginSelections();

    setSelectionScatterVisible(true);

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
    //      select(0, [dim[Object.keys(dim)[1]]]);
    //    } else {
    //      select(
    //        0,
    //        itemsSelected.filter(
    //          (e) => e !== dim[Object.keys(dim)[1]]
    //        )
    //      );
    //    }
    //  } else {
    //    select(0, [dim[Object.keys(dim)[1]]]);
    //  }

    // buildSelections(pendingSelections);

    select(0, pendingSelections);
  }

  const tooltipContainer = d3.select(d3Container.current);
  const tooltip = addTooltip({
    tooltipContainer,
    TooltipWrapper,
  });

  const formatValue = (val, precision, sign) => {
    let formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  function handleMouseOver() {
    d3.select(this).style("cursor", "pointer");
  }

  function handleMouseMove(d, i) {
    d3.select(this).style("cursor", "pointer");

    const cursorLocation = d3.mouse(this);
    let data = {};

    data = {
      key: d[Object.keys(d)[0]],
      value: `${Object.keys(d)[2]} : ${formatValue(d[Object.keys(d)[2]])}, ${
        Object.keys(d)[3]
      } : ${formatValue(d[Object.keys(d)[3]])}`,
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

  const drawScatterLabels = (scatterLabels, measureName, index) => {
    const labels = scatterLabels
      .enter()
      .append("text")
      .attr("data-measure-label", measureName)
      .attr("transform", `translate(0,${titleHeights})`)
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => xScale(d[Object.keys(d)[2]]))
      .attr("y", (d) => height - titleHeights - xAxisTextHeight - legendHeight)
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay((d, i) => delayMilliseconds / qItems)
      .text((d) => formatValue(d[Object.keys(d)[index]]))
      .attr("y", (d) => yScale(d[Object.keys(d)[3]]))
      .attr("dy", "-.7em");

    setStyle(labels, ScatterLabelStyle);
  };

  const diagram = svg
    .append("g")
    .attr("class", "focus")
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

  let yOverview = null;
  let yScale = null;
  let titleHeights = 0;

  const xAxisDiag = diagram.append("g").attr("class", "x axis");

  setStyle(xAxisDiag, xAxisStyle);

  let xAxisTextHeight = 10;

  function setHeight() {
    if (isScrollDisplayed) {
      height = +parseInt(heightValue, 10) - margin.top - margin.bottom;
      heightOverview =
        +parseInt(heightValue, 10) - marginOverview.top - marginOverview.bottom;
    } else {
      margin.bottom = marginOverview.bottom;
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
          (isScrollDisplayed ? marginOverview.bottom : 0)
      )}`;

    // Reduce top margin if Titles take up much space.
    titleHeights =
      titleHeights / (height - titleHeights - xAxisTextHeight - legendHeight) >
      1
        ? (titleHeights -= margin.top / 2)
        : titleHeights;

    titleHeights = titleHeights > 0 ? titleHeights - margin.top : titleHeights;

    yScale = d3
      .scaleLinear()
      .range([height - titleHeights - xAxisTextHeight - legendHeight, 0]);

    xAxisDiag
      .attr(
        "transform",
        `translate(0,${height - xAxisTextHeight - legendHeight})`
      )
      .call(xAxis);

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

  if (["none", "yAxis"].some((substring) => showAxis.includes(substring))) {
    xAxisDiag
      .select(".axis--x")
      .select(".domain")
      .remove();

    xAxisDiag
      .select(".axis--x")
      .selectAll(".tick")
      .selectAll("line")
      .remove();
  }
  xAxisDiag.attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null);
  const xValues = xAxisDiag.selectAll("g.tick");

  xValues.each(function(i) {
    const self = d3.select(this);
    const textItem = self.select("text");
    const newValue = formatValue(
      parseFloat(textItem.text().replace(/,/g, "")),
      true
    );
    textItem.text(newValue);
  });

  if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
    // text label for the x axis
    xAxisText = diagram
      .append("text")
      .style("text-anchor", "middle")
      .text(qHyperCube.qMeasureInfo[0].qFallbackTitle);

    setStyle(xAxisText, axisTitleStyle);

    xAxisTextHeight =
      xAxisText.node().getBBox().height + (isScrollDisplayed ? 10 : 0);
  }

  setHeight();

  if (["both", "xAxis"].some((substring) => textOnAxis.includes(substring))) {
    xAxisText.attr(
      "transform",
      `translate(${width / 2} ,${height +
        margin.top -
        legendHeight +
        (isScrollDisplayed ? 5 : 0)})
          `
    );
  }
  createScatters(diagram, data);
  if (showLabels !== "none") createLabels(diagram, data); // Value Labels for Chart Scatters

  function brushed() {
    const { selection } = d3.event;
    xScale.domain(selection.map(xOverview.invert, xOverview));
    diagram
      .selectAll("circle")
      .attr("cx", (d) => xScale(d[Object.keys(d)[2]]))
      .attr("cy", (d) => yScale(d[Object.keys(d)[3]]));

    const labels = diagram.selectAll("[data-measure-label]");

    labels.attr("x", (d) => xScale(d[Object.keys(d)[2]]));

    diagram.select(".axis.x").call(xAxis);

    if (["none", "yAxis"].some((substring) => showAxis.includes(substring))) {
      diagram
        .select(".axis.x")
        .select(".domain")
        .remove();

      diagram
        .select(".axis.x")
        .selectAll(".tick")
        .selectAll("line")
        .remove();
    }

    const xValues = xAxisDiag.selectAll("g.tick");

    xValues.each(function(i) {
      const self = d3.select(this);
      const textItem = self.select("text");
      const newValue = formatValue(
        parseFloat(textItem.text().replace(/,/g, "")),
        true
      );
      textItem.text(newValue);
    });
  }

  const brush = d3
    .brushX()
    .extent([
      [0, -legendHeight],
      [width - legendLeftPadding, heightOverview - legendHeight],
    ])
    .on("brush", brushed);

  function setupMiniChart(diagram, data) {
    const scatters = null;
    const context = svg
      .append("g")
      .attr("class", "context")
      .attr(
        "transform",
        `translate(${marginOverview.left},${marginOverview.top})`
      );

    // Add dots
    const dots = context
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "scatter")
      .attr("cx", (d) => xOverview(d[Object.keys(d)[2]]))
      .attr("cy", (d) => yOverview(d[Object.keys(d)[3]]) - legendHeight)
      .attr("r", ScatterMarkerStyle.overviewMarker)
      .style("fill", (d, i) =>
        conditionalColors.length === 0 ? color(d[Object.keys(d)[0]]) : color(i)
      );

    context
      .append("g")
      .attr("class", "x axis")
      .attr(
        "transform",
        "translate(0," + `${heightOverview - legendHeight}` + ")"
      )
      .call(xAxisOverview);

    context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      //  .call(brush.move, xScale.range()); // AG
      // .call(brush.move, [xOverview(startBrush), xOverview(endBrush)]); // AG
      .call(
        brush.move,
        scrollRatio
          ? [xScale.range()[0], Math.ceil(xScale.range()[1] * scrollRatio)]
          : xScale.range()
      );
    // .call(brush.move, [0, 500]); // AG

    if (allowZoom || ScatterDefault.allowZoom) {
    } else {
      // removes handle to resize the brush
      context.selectAll(".brush>.handle").remove();
      // removes crosshair cursor
      context.selectAll(".brush>.overlay").remove();
    }
  }

  isScrollDisplayed && setupMiniChart(diagram, data);

  let xAxisText = null;

  function createScatters(diagram, data) {
    createYAxis(diagram, data);

    const dots = diagram
      .append("g")
      .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
      .attr("transform", `translate(0,${titleHeights})`);

    dots
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", ScatterMarkerStyle.mainMarker)
      .attr("cx", (d) => xScale(d[Object.keys(d)[2]]))
      .attr("cy", (d) => yScale(d[Object.keys(d)[3]]))
      .style("fill", (d, i) =>
        conditionalColors.length === 0 ? color(d[Object.keys(d)[0]]) : color(i)
      )
      .on("click", allowSelections ? handleClick : null)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);
    setStyle(dots, ScatterOverviewScatter);
  }

  // Group Setup for Value Labels for Chart Scatters
  function createLabels(diagram, data) {
    diagram.selectAll(".line-labels").remove();

    let scatterLabels = null;

    scatterLabels = diagram
      .append("g")
      .attr("clip-path", isScrollDisplayed ? `url(#${uuid})` : null)
      .attr("class", "scatter-labels")
      .selectAll("[data-measure-label]")
      .data(data, (d) => d[Object.keys(d)[0]]);

    drawScatterLabels(scatterLabels, rangeBands[0], measureStartPosition);
  }

  if (["both", "xAxis"].some((substring) => showAxis.includes(substring))) {
    if (qMinY < 0) {
      diagram
        .append("line")
        .attr("transform", `translate(0,${titleHeights})`)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("x1", 0)
        .attr("x2", xScale.range()[1])
        .attr("stroke", "black");

      diagram
        .select(".x.axis")
        .select(".domain")
        .remove();
    }
    if (qMinX < 0) {
      diagram
        .append("line")
        .attr("transform", `translate(0,${titleHeights})`)
        .attr("y1", 0)
        .attr("y2", yScale.range()[0])
        .attr("x1", xScale(0))
        .attr("x2", xScale(0))
        .attr("stroke", "black");

      diagram
        .select(".y.axis")
        .select(".domain")
        .remove();

      diagram
        .select(".y.axis")
        .selectAll("g.tick")
        .selectAll("line")
        .remove();
    }
  }
}
