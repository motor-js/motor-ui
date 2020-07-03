// github.com/chrisrzhou/react-wordcloud
import * as d3 from "d3";
import cloud from "d3-cloud";
import {
  roundNumber,
  hyperCubeTransform,
  colorByExpression,
} from "../../../utils";

import {
  addTitle,
  addSubTitle,
  addTooltip,
  showTooltip,
  hideTooltip,
} from "../../D3";

import { setStyle } from "../../D3/Helpers";

export default function CreateWordCloud({
  qLayout,
  qData,
  // chartWidth,
  chartHeight,
  d3Container,
  screenWidth,
  useSelectionColours,
  setRefreshChart,
  beginSelections,
  setSelectionWordCloudVisible,
  allowSelections,
  // buildSelections,
  selections,
  select,
  title,
  subTitle,
  WordCloudThemes,
  ToolTipThemes,
  TitleThemes,
  roundNum,
} = chartSettings) {
  const { TooltipWrapper, TooltipShowStyle, TooltipHideStyle } = ToolTipThemes;

  const { TitleStyle, SubTitleStyle } = TitleThemes;

  const {
    WordCloudChartStyle,
    // WordCloudStyle,
    // WordCloudDefault,
    // WordCloudLabelStyle,
    // WordCloudSelectionStyle,
    WordCloudSelected,
    WordCloudNonSelected,
    colorPalette,
  } = WordCloudThemes;

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

    const cursorLocation = [d3.event.layerX, d3.event.layerY];

    const data = {
      key: d.text,
      value: formatValue(d.size),
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

  const setWordCloudColors = () => {
    diagram.selectAll("text").each(function() {
      const self = d3.select(this);
      const selected = pendingSelections.includes(
        parseInt(this.getAttribute("elemNumber"))
      );
      if (useSelectionColours) {
        selected
          ? setStyle(self, WordCloudSelected)
          : setStyle(self, WordCloudNonSelected);
      }
    });
  };

  // Create Event Handlers for mouse
  function handleClick(d, i) {
    const selectionValue = parseInt(this.getAttribute("elemNumber"));

    setRefreshChart(false);
    useSelectionColours = true;

    let updateList = [];

    if (pendingSelections.includes(selectionValue)) {
      updateList = pendingSelections.filter((item) => item != selectionValue);
      pendingSelections = updateList;
    } else {
      pendingSelections = [...pendingSelections, selectionValue];
    }

    setWordCloudColors();

    beginSelections();

    setSelectionWordCloudVisible(true);

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

  setStyle(svg, WordCloudChartStyle);

  const diagram = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const dataKeys = qDataSet.map((d) => d[Object.keys(d)[0]]);

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

  heightValue = heightValue - titleHeight - subTitleHeight;

  const g = diagram.attr(
    "transform",
    `translate(${screenWidth / 2},${heightValue / 2 +
      titleHeight +
      subTitleHeight})` // + 100 ??
  );

  // This function takes the output of 'layout' above and draw the words
  // Better not to touch it. To change parameters, play with the 'layout' variable above
  function draw(words) {
    g.selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", (d) => `${d.size}px`)
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .attr("elemNumber", (d, i) => {
        const item = qDataSet.filter((d, index) => index === i);

        return item[0].elemNumber;
      })
      .text((d) => d.text)
      .style("fill", (d) => color(d[Object.keys(d)[0]]))
      .on("click", allowSelections ? handleClick : null)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);
  }

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  const layout = cloud()
    .size([screenWidth, heightValue])
    .words(qDataSet.map((d) => ({ text: d[Object.keys(d)[0]] })))
    .padding(10)
    // .fontSize(60)
    .fontSize(20)
    .on("end", draw);
  layout.start();
}
