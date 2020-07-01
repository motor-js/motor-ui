import * as d3 from 'd3';
import { setStyle } from '../Helpers';

export const addLegend = ({
  showLegend,
  svg,
  dataKeys,
  color,
  margin,
  LegendWrapper,
  LegendGroup,
  LegendTextStyle,
  ArrowStyle,
  ArrowDisabledStyle,
  // legendPadding = 5,
}) => {
  let items = {};
  const marginBottom = 20;
  let orientation = 'right';

  const legendSidePadding = 5;
  const legendAboveBelowPadding = 5;

  const svgWidth = svg.node().width.baseVal.value;
  const svgHeight = svg.node().height.baseVal.value;

  let legendWidth = 0;
  let legendHeight = 0;

  if (showLegend === 'none') return { legendWidth, legendHeight };

  const { calcWidth, calcHeight } = getLegendSize({
    svg,
    items: dataKeys,
    width: svgWidth - margin.left,
  });

  const width = svgWidth - calcWidth;

  const chartToSVGRatio = 0.2;

  if (calcWidth / width > chartToSVGRatio && dataKeys.length > 10)
    return { legendWidth, legendHeight };
  if (
    showLegend === 'bottom' ||
    calcWidth / width > chartToSVGRatio ||
    width < 0
  )
    orientation = 'bottom';

  dataKeys.map((d) => {
    items[d] = {
      item: d,
      color: color(d),
    };
  });

  items = d3.entries(items).sort((a, b) => a.value.item - b.value.item);

  const arrowHeight = 25;
  const chartArea =
    orientation === 'right'
      ? svg.node().height.baseVal.value - margin.top - marginBottom - 15
      : svg.node().width.baseVal.value - margin.left - margin.right - 15;
  const noOfItems =
    orientation === 'right' ? chartArea / calcHeight : chartArea / calcWidth;

  let startPos = 0;
  let endPos = noOfItems;
  let sliced = items.slice(startPos, endPos);
  let isArrowDisplayed = items.length > noOfItems;

  const noOfPossibleRows = Math.floor((svgHeight * 0.2) / calcHeight);
  const noOfRequiredRows = Math.ceil(dataKeys.length / endPos);

  if (
    noOfPossibleRows >= noOfRequiredRows &&
    orientation === 'bottom' &&
    Math.floor(noOfItems) > dataKeys.length / noOfRequiredRows
  ) {
    sliced = items;
    isArrowDisplayed = false;
  }
  if (orientation === 'bottom' && Math.floor(noOfItems) <= 1) {
    legendWidth = 0;
    legendHeight = 0;

    return { legendWidth, legendHeight };
  }

  const legendContaner = svg
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) =>
      orientation === 'right'
        ? `translate(${calcWidth - margin.right},${margin.top})`
        : `translate(${0},${svgHeight - calcHeight})`
    );

  function drawLegend(data) {
    const legendBox = legendContaner
      .selectAll('.legend-box')
      .data([true])
      .enter()
      .append('rect')
      .classed('legend-box', true);

    const legend = legendContaner
      .selectAll('.legend')
      .data(sliced)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) =>
        orientation === 'right'
          ? `translate(0,${i * calcHeight})`
          : sliced !== items
          ? `translate(${i * calcWidth},${-legendAboveBelowPadding})`
          : `translate(${calcWidth *
              (i % (dataKeys.length / noOfRequiredRows))},
              ${Math.floor(i / (dataKeys.length / noOfRequiredRows)) *
                calcHeight -
                legendAboveBelowPadding})`
      );

    setStyle(legend, LegendGroup);

    legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d) => d.value.color);

    const legendText = legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => d.key);

    setStyle(legendText, LegendTextStyle);

    // Reposition and resize the box
    const lbbox = legendContaner.node().getBBox();
    legendBox
      .attr('width', (d, i) =>
        orientation === 'right'
          ? `${calcWidth}`
          : ` ${
              isArrowDisplayed
                ? sliced.length * calcWidth
                : lbbox.width + 2 * legendSidePadding
            }`
      )
      .attr('x', (d, i) =>
        orientation === 'right'
          ? `${lbbox.x + lbbox.width + legendSidePadding - calcWidth}`
          : ` ${
              isArrowDisplayed
                ? lbbox.x +
                  lbbox.width +
                  legendSidePadding -
                  calcWidth * sliced.length
                : lbbox.x - legendSidePadding
            }`
      )
      .attr('y', (d, i) =>
        orientation === 'right'
          ? `${lbbox.y - legendSidePadding}`
          : `${lbbox.y - legendAboveBelowPadding}`
      )
      .attr('height', (d, i) =>
        orientation === 'right'
          ? `${lbbox.height +
              2 * legendSidePadding +
              (isArrowDisplayed ? arrowHeight : 0)}`
          : `${lbbox.height + 2 * legendAboveBelowPadding}`
      );

    setStyle(legendBox, LegendWrapper);
  }
  drawLegend(sliced);
  const lbbox = legendContaner.node().getBBox();

  if (isArrowDisplayed) {
    const downArrow = legendContaner
      .selectAll('.symbol')
      .data([0])
      .enter()
      .append('path')
      .attr('transform', (d, i) =>
        orientation === 'right'
          ? `translate(${lbbox.x + lbbox.width * 0.35},${lbbox.height -
              arrowHeight +
              4})rotate(180)`
          : `translate(${lbbox.x - 10},${lbbox.height -
              arrowHeight +
              10 -
              2 * legendAboveBelowPadding})rotate(270)`
      )
      .attr(
        'd',
        d3
          .symbol()
          .size(100)
          .type(d3.symbolTriangle)
      )
      .on('click', (d) => {
        if (startPos !== 0) {
          startPos -= 1;
          endPos -= 1;
          sliced = items.slice(startPos, endPos);
          legendContaner.selectAll('.legend-item').remove();
          drawLegend(sliced);
          setStyle(downArrow, startPos !== 0 ? ArrowStyle : ArrowDisabledStyle);
          setStyle(
            upArrow,
            endPos !== items.length ? ArrowStyle : ArrowDisabledStyle
          );
        }
      });

    setStyle(downArrow, startPos !== 0 ? ArrowStyle : ArrowDisabledStyle);

    const upArrow = legendContaner
      .selectAll('.symbol')
      .data([0])
      .enter()
      .append('path')
      .attr('transform', (d, i) =>
        orientation === 'right'
          ? `translate(${lbbox.x + lbbox.width * 0.65},${lbbox.height -
              arrowHeight +
              4})`
          : `translate(${lbbox.x + lbbox.width + 10},${lbbox.height -
              arrowHeight +
              10 -
              2 * legendAboveBelowPadding})rotate(90)`
      )
      .attr(
        'd',
        d3
          .symbol()
          .size(100)
          .type(d3.symbolTriangle)
      )
      .on('click', (d) => {
        if (endPos < items.length) {
          startPos += 1;
          endPos += 1;
          sliced = items.slice(startPos, endPos);
          legendContaner.selectAll('.legend-item').remove();
          drawLegend(sliced);
          setStyle(downArrow, startPos !== 0 ? ArrowStyle : ArrowDisabledStyle);
          setStyle(
            upArrow,
            endPos !== items.length ? ArrowStyle : ArrowDisabledStyle
          );
        }
      });

    setStyle(upArrow, ArrowStyle);
  }

  const legendItem = svg.select('.legend');

  legendWidth = orientation === 'right' ? legendItem.node().getBBox().width : 0;
  legendHeight =
    orientation === 'right'
      ? 0
      : legendItem.node().getBBox().height + 2 * legendAboveBelowPadding;

  if (orientation === 'bottom') {
    legendItem.attr(
      'transform',
      (d, i) => `translate(${svgWidth / 2 -
        legendItem.node().getBBox().x -
        legendItem.node().getBBox().width / 2}
      ,${svgHeight - legendItem.node().getBBox().height})`
    );
  }

  return { legendWidth, legendHeight };
};

export const getLegendSize = ({ svg, items, width }) => {
  const focus = svg.append('g').attr('class', 'legendSize');
  const legendSidePadding = 5;
  const legendAboveBelowPadding = 2;
  items = [items.reduce((a, b) => (a.length > b.length ? a : b), '')];
  const legend = focus
    .selectAll('.legend')
    .data(items)
    .enter()
    .append('g')
    .attr('class', 'legend-item');

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18);

  legend
    .append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text((d) => d);

  const legendItem = svg.select('.legendSize');

  const calcWidth = legendItem.node().getBBox().width + 2 * legendSidePadding;
  const calcHeight =
    legendItem.node().getBBox().height + legendAboveBelowPadding;
  legendItem.remove();

  return { calcWidth, calcHeight };
};
