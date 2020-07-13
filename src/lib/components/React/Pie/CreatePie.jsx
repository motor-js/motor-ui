import * as d3 from "d3";
import { hyperCubeTransform, colorByExpression } from "../../../utils";
import { roundNumber } from "../../../utils";

import {
  addTitle,
  addSubTitle,
  addLegend,
  addTooltip,
  showTooltip,
  hideTooltip,
} from "../../D3";

import { setStyle } from "../../D3/Helpers";

export default function CreatePie({
  qLayout,
  qData,
  // chartWidth,
  chartHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionPieVisible,
  selections,
  select,
  // buildSelections,
  title,
  subTitle,
  showLegend,
  allowSelections,
  PieThemes,
  ToolTipThemes,
  TitleThemes,
  LegendThemes,
  roundNum,
  innerRadius,
  cornerRadius,
  padAngle,
  showLabels,
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
    PieChartStyle,
    PieDefault,
    PieLabelStyle,
    colorPalette,
    SelectedPie,
    NonSelectedPie,
  } = PieThemes;

  const qDataSet = hyperCubeTransform(qData, qLayout.qHyperCube);

  // Check if width is % or number in px
  // const screenWidth = /^\d+(\.\d+)?%$/.test(chartWidth)
  //   ? (+parseInt(chartWidth, 10) / 100) * screenWidth
  //   : +parseInt(chartWidth, 10);
  // const screenWidth = screenWidth;

  // Check if height is % or number in px
  let heightValue = /^\d+(\.\d+)?%$/.test(chartHeight)
    ? (+parseInt(chartHeight, 10) / 100) * window.innerHeight
    : +parseInt(chartHeight, 10);

  const margin = {
    top: 10,
    right: 30,
    bottom: 100,
    left: 30,
  };

  // Check if conditionalColors and if so get the returned color pallette
  const conditionalColors = colorByExpression(
    qLayout.qHyperCube,
    qData.qMatrix,
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

    const cursorLocation = [d3.event.layerX + 5, d3.event.layerY + 10];

    const data = {
      key: d.data[Object.keys(d.data)[0]],
      value: formatValue(d.data[Object.keys(d.data)[2]]),
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

  const setPieColors = () => {
    svg.selectAll("path").each(function() {
      const self = d3.select(this);
      const selected = pendingSelections.includes(
        parseInt(this.getAttribute("elemNumber"))
      );
      if (useSelectionColours) {
        selected ? setStyle(self, SelectedPie) : setStyle(self, NonSelectedPie);
      }
    });
  };

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    const selectionValue = d.data.elemNumber;

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      pendingSelections = updateList;
    } else {
      pendingSelections = [...pendingSelections, selectionValue];
    }

    setPieColors();

    beginSelections();

    setSelectionPieVisible(true);

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
    //     select(0, [selectionValue]);
    //   } else {
    //     select(
    //       0,
    //       itemsSelected.filter((e) => e !== selectionValue)
    //     );
    //   }
    // } else {
    //   select(0, [selectionValue]);
    // }

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

  setStyle(svg, PieChartStyle);

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
  const radius = Math.min(screenWidth, heightValue) / 3;

  const pie = d3.pie().value((d) => d[Object.keys(d)[2]])(qDataSet);

  const arc = d3
    .arc()
    .outerRadius(radius * 0.9)
    .innerRadius(innerRadius)
    .padAngle(padAngle)
    .cornerRadius(cornerRadius);

  const outerArc = d3
    .arc()
    .outerRadius(radius * 0.9)
    .innerRadius(radius * 0.9);

  const pieContainer = diagram.append("g").attr("class", "pie");

  const g = pieContainer.attr(
    "transform",
    `translate(${screenWidth / 2},${heightValue / 2 +
      titleHeight +
      subTitleHeight})`
  );

  g.selectAll("arc")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "arc")
    .append("path")
    .attr("d", arc)
    .style("fill", (d, i) => color(dataKeys[i]))
    .attr("elemNumber", (d) => d.data.elemNumber)
    .on("mousemove", handleMouseMove)
    .on("mouseout", handleMouseOut)
    .on("click", allowSelections ? handleClick : null);

  // Add the chart labels
  const addLabels = (style) => {
    const labels = g
      .selectAll("allLabels")
      .data(pie)
      .enter()
      .append("text")
      .text((d) => d.data[Object.keys(d.data)[0]])
      .attr("class", (d, i) => `label-text${i}`)
      .attr("x", (d) => {
        if (style === "in") {
          const a = arc.centroid(d)[0];
          d.x = a;

          return d.x;
        }
        const centroid = outerArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        const mid = Math.cos(midAngle) * 180;
        const offset = mid > 0 ? 30 : -30;
        const x = Math.cos(midAngle) * radius + offset;

        return x;
      })
      .attr("y", (d) => {
        if (style === "in") {
          const a = arc.centroid(d)[1];
          d.y = a;

          return d.y;
        }
        const centroid = outerArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        const y = Math.sin(midAngle) * radius;

        return y;
      })
      .attr("text-anchor", (d) => {
        const center = arc.centroid(d);
        const midAngle = Math.atan2(center[1], center[0]);
        const x = Math.cos(midAngle) * 180;
        //  if (style === 'in') return 'middle'
        return x > 0 ? "start" : "end";
      });

    const lines = g
      .selectAll("allLines")
      .data(pie)
      .enter()
      .append(style !== "in" && style !== "altStyle" && "line")
      .attr("class", "label-line")
      .attr("stroke", (d, i) => color(dataKeys[i]))
      .attr("x1", (d) => outerArc.centroid(d)[0])
      .attr("y1", (d) => outerArc.centroid(d)[1])
      .attr("x2", (d) => {
        const centroid = outerArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        const mid = Math.cos(midAngle) * 180;
        const offset = mid > 0 ? 25 : -25;
        const x = Math.cos(midAngle) * radius + offset;

        return x;
      })
      .attr("y2", (d) => {
        const centroid = outerArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        const y = Math.sin(midAngle) * radius;

        return y;
      });

    // variables for label adjustment
    const alpha = 1.5;
    const spacing = 20;

    // adjust the labels to remove overlapping
    const adjustLabels = (style) => {
      // set loop condition to false
      let again = false;
      // loop text labels twice to compare each labels position
      labels.each((d, i) => {
        const da = d3.select(d3Container.current).select(`.label-text${i}`);
        if (da._groups[0][0]) {
          const y1 = da.attr("y");
          const a = da.attr("class");
          labels.each((d, i) => {
            const db = d3.select(d3Container.current).select(`.label-text${i}`);
            const y2 = db.attr("y");
            const b = db.attr("class");
            // if the nodes are the same, do nothing
            if (a === b) {
              return;
            }
            // if the nodes are on opposite sides of the pivot, do nothing
            if (da.attr("text-anchor") !== db.attr("text-anchor")) {
              return;
            }
            // calculate delta spacing
            const deltaY = y1 - y2;
            // if there is sufficient distance between nodes, do nothing
            if (Math.abs(deltaY) > spacing) {
              return;
            }
            // if the labels are in the pivot and overlapping, remove overlapping labels
            if (style === "in") {
              da.text(null);
            }

            // add variable for loop. Labels will be moved until there is no overlapping
            again = true;
            // otherwise, adjust the y position of the text labels
            const sign = deltaY > 0 ? 1 : -1;
            const adjust = sign * alpha;
            da.attr("y", +y1 + adjust);
            db.attr("y", +y2 - adjust);
          });
        }
      });
      style === "in" && labels.attr("text-anchor", "middle");

      if (style !== "in" && style !== "altStyle" && again) {
        lines.attr("y2", (d, i) => {
          const labelForLine = d3
            .select(d3Container.current)
            .select(`.label-text${i}`);

          return labelForLine.attr("y");
        });
        setTimeout(adjustLabels, 20);
      }
    };
    setStyle(labels, PieLabelStyle);
    style !== "in" ? adjustLabels() : adjustLabels("in");
  };

  console.log(showLabels);

  switch (showLabels) {
    case "inside":
      addLabels("in");
      break;
    case true || "outside":
      addLabels();
      break;
    case "altStyle":
      addAltLabels();
      break;
    case false || "none":
      // don't add labels
      break;
    default:
  }
}
