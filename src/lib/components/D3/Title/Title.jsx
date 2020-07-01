import { setStyle } from '../Helpers';

export const addTitle = ({ svg, title, TitleStyle }) => {
  const { padding } = TitleStyle;

  const focus = svg.select('.focus');

  const marginTop = focus.node().transform.baseVal[0].matrix.f;
  const svgWidth = svg.node().width.baseVal.value;
  const focusTransform = focus.node().transform.baseVal[0].matrix.e;

  let x;
  if (TitleStyle['text-anchor'] === 'middle') {
    x = svgWidth / 2 - focusTransform;
  }

  // focus
  //   .append('rect')
  //   .attr('transform', 'translate(0,-5)')
  //   .attr('width', 800)
  //   .attr('height', '25px')
  //   .style('fill', 'lightgray');

  const cap = focus
    .append('g')
    .attr('class', 'title')
    .append('text')
    .attr('x', x)
    .text(title);

  setStyle(cap, TitleStyle);

  const titleSelection = svg.select('.title');
  const { height } = titleSelection.node().getBBox();
  titleSelection.select('text').attr('y', -marginTop + height + padding);

  return height + padding * 2;
};

export const addSubTitle = ({ svg, subTitle, SubTitleStyle }) => {
  const { padding } = SubTitleStyle;

  const focus = svg.select('.focus');
  const marginTop = focus.node().transform.baseVal[0].matrix.f;

  const svgWidth = svg.node().width.baseVal.value;
  const focusTransform = focus.node().transform.baseVal[0].matrix.e;

  let x;
  if (SubTitleStyle['text-anchor'] === 'middle') {
    // x = (svgWidth - focusTransform) / 2;
    x = svgWidth / 2 - focusTransform;
  }

  const subTitleObj = focus
    .append('g')
    .attr('class', 'sub-title')
    .append('text')
    .attr('x', x)
    .text(subTitle);

  setStyle(subTitleObj, SubTitleStyle);

  const title = svg.select('.title');

  let titleHeight = !title.empty()
    ? (titleHeight = title.node().getBBox().height += padding * 2)
    : 0;

  const subTitleSelection = svg.select('.sub-title');
  const { height } = subTitleSelection.node().getBBox();
  subTitleSelection
    .select('text')
    .attr('y', -marginTop + titleHeight + height + padding);

  return titleHeight + height + padding * 2;
};
