import * as React from "react";
import {
  configType,
  sizeType,
  calcCondType,
} from '../../../utils'

export interface BarProps {
config: configType,
label: string,
cols: Array<string>,
calcCondition: calcCondType,
suppressZero: boolean,
columnSortOrder: Array<string>,
sortDirection: string,
width: string,
height: string,
margin: string,
size: sizeType,
showLabels: PropTypes.oneOf(['top', 'none', 'inside']),
textOnAxis: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['both', 'yAxis', 'xAxis', 'none']),
]),
tickSpacing: PropTypes.oneOf(['wide', 'normal', 'narrow']),
showAxis: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['both', 'yAxis', 'xAxis', 'none']),
]),
maxAxisLength: PropTypes.number,
allowSlantedYAxis: PropTypes.bool,
showGridlines: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['solid', 'dashes', 'dots', 'none']),
]),
fontColor: PropTypes.string,
border: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf([
    'top',
    'left',
    'bottom',
    'right',
    'start',
    'end',
    'horizontal',
    'vertical',
    'all',
    'between',
  ]),
  PropTypes.shape({
    color: PropTypes.oneOfType([PropTypes.string]),
    side: PropTypes.oneOf([
      'top',
      'left',
      'bottom',
      'right',
      'start',
      'end',
      'horizontal',
      'vertical',
      'all',
      'between',
    ]),
    size: PropTypes.oneOfType([PropTypes.string]),
    style: PropTypes.oneOf([
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
      'hidden',
    ]),
  }),
  PropTypes.arrayOf(BORDER_SHAPE),
]),
backgroundColor: PropTypes.string,
chartColor: PropTypes.oneOfType([
  PropTypes.oneOf([
    'divergent13',
    'divergent9',
    'goya',
    'red',
    'blue',
    'gray',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'orange',
    'base',
  ]),
  PropTypes.array,
]),
/** Stacked Chart  */
stacked: PropTypes.bool,
/** Stacked Chart  */
percentStacked: PropTypes.bool,
/** RoundNum of the Bar */
roundNum: PropTypes.bool,
/** Title of the Bar */
title: PropTypes.string,
/** Sub Title of the Bar */
subTitle: PropTypes.string,
/** Legend of the Bar */
showLegend: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['right', 'bottom']),
]),
/** Allow Selections */
allowSelections: PropTypes.bool,
/** Maximum Width of the Bar */
maxWidth: PropTypes.number,
/** Force supression of Scroll / Overview chart */
suppressScroll: PropTypes.bool,
// /** Allow for bushes to be resized on chart */
// allowZoom: PropTypes.bool, // Descoped to later version
// /** Ratio of the size 0f the scroll bar (Range 0 - 1) */
// scrollRatio: PropTypes.number, // Descoped to later version
/** Pddding for each bar */
barPadding: PropTypes.number,
/** Error messgae to display when invalid dimension */
dimensionErrMsg: PropTypes.string,
/** Error messgae to display when invalid measure */
measureErrMsg: PropTypes.string,
/** Show values as Other */
otherTotalSpec: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.shape({
    qOtherLabel: PropTypes.string,
    qOtherCount: PropTypes.string,
  }),
]),
}

declare const Bar: React.FC<BarProps>;

export type BarType = BarProps

export default Bar
