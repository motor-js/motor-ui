import styled from "styled-components";
import { ChevronUp } from "@styled-icons/feather/ChevronUp";
import { ChevronDown } from "@styled-icons/feather/ChevronDown";
import { Search } from "@styled-icons/feather/Search";
import { X } from "@styled-icons/feather/X";
import { defaultProps } from "../../../default-props";
import { globalStyle } from "../../../utils/styles";
import { selectColor } from "../../../utils/colors";

const FilterWrapper = styled.div`
  ${globalStyle};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
`;

const FilterWrapperNoData = styled.div`
  ${globalStyle};
  border: ${(props) => props.theme.filter.title.border};
  border-color: ${(props) =>
    selectColor(props.theme.filter.title.borderColor, props.theme)};
  border-radius: ${(props) => props.theme.filter.title.radius};
  min-height: 30px;
  align-items: ${(props) => props.theme.global.chart.noData.alignItems};
  justify-content: ${(props) => props.theme.global.chart.noData.justifyContent};
  display: ${(props) => props.theme.global.chart.noData.display};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.theme.filter.title.justifyContent};
  color: ${(props) => props.theme.filter.color.fontTitle};
  border: ${(props) => props.theme.filter.title.border};
  
  border-color: ${(props) =>
    props.selections && props.selections.length > 0
      ? selectColor(props.theme.filter.selected.borderColor, props.theme)
      : selectColor(props.theme.filter.title.borderColor, props.theme)};
  background-color: ${(props) =>
    selectColor(props.theme.filter.color.backgroundColor, props.theme)};
  border-radius: ${(props) => props.theme.filter.title.radius};
  padding: 0.6em 0 0.6em 0em;
  cursor: pointer;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  white-space: nowrap;
  overflow-x: hidden;
  &:hover {
    border-color:  ${(props) =>
      props.selections && props.selections.length > 0
        ? selectColor(props.theme.filter.selected.borderColor, props.theme)
        : selectColor(props.theme.filter.hover.borderColor, props.theme)}
`;

const FilterTitleDim = styled.span`
  padding-left: 1.2em;
  max-width: 100%;
  overflow-x: hidden;
`;

const FilterTitleItems = styled.span`
  padding-left: 1.2em;
  max-width: 100%;
  overflow-x: hidden;
  color: ${(props) => props.theme.global.color.font};
`;

const FilterList = styled.div`
  height: ${(props) => props.dropHeight};
  border: ${(props) => props.theme.filter.dropdown.border};
  border-color: ${(props) =>
    selectColor(props.theme.filter.dropdown.borderColor, props.theme)};
  border-radius: ${(props) => props.theme.filter.dropdown.radius};
  margin-top: ${(props) => props.theme.filter.dropdown.marginTop};
  background-color: ${(props) => props.theme.global.backgroundColor};
  color: ${(props) => props.theme.global.color.font};
  z-index: 100;
  font-family: ${(props) => props.theme.global.fontFamily};
  cursor: pointer;
  user-select: none;
  box-shadow: ${(props) => props.theme.filter.dropdown.shadow};
  white-space: nowrap;
  position: absolute;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ChevronUpIcon = styled(ChevronUp)`
  margin-left: auto;
  margin-right: 10px;
  color: ${(props) => selectColor(props.theme.filter.color.icon, props.theme)};
`;

const ChevronDownIcon = styled(ChevronDown)`
  margin-left: auto;
  margin-right: 10px;
  color: ${(props) => selectColor(props.theme.filter.color.icon, props.theme)};
`;

const FilterSearchGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.global.backgroundColor};
`;

const SearchStyle = styled(Search)`
  padding: 0 5px 0 10px;
  color: ${(props) => selectColor(props.theme.filter.color.icon, props.theme)};
`;

const FilterSearch = styled.input`
  width: 70%;
  height: 32px;
  outline: none;
  border: none;
  font-size: ${(props) => props.theme.global.size.font[props.size]};
  margin: 1px;
  background-color: ${(props) => props.theme.global.color.backgroundColor};
`;

const XStyle = styled(X)`
  margin-left: auto;
  padding-right: 5px;
  color: ${(props) => selectColor(props.theme.filter.color.icon, props.theme)};
`;

const StyledFilterListItem = styled.div.attrs((props) => {
  let bkgClr;
  let txtClr;
  switch (props.selected) {
    case "S":
      bkgClr = selectColor(props.theme.filter.color.selected, props.theme);
      txtClr = selectColor(props.theme.filter.color.selectedFont, props.theme);
      break;
    case "O":
      bkgClr = props.theme.global.backgroungColor;
      txtClr = props.theme.global.color.font;
      break;
    case "A":
      bkgClr = selectColor(props.theme.filter.color.altSelection, props.theme);
      txtClr = props.theme.global.color.font;
      break;
    case "X":
      bkgClr = selectColor(props.theme.filter.color.notSelected, props.theme);
      txtClr = props.theme.global.color.font;
      break;
    default:
      bkgClr = props.theme.global.backgroungColor;
      txtClr = props.theme.global.color.font;
      break;
  }

  return {
    style: {
      top: `${props.i * props.rowHeight}px`,
      backgroundColor: bkgClr,
      color: txtClr,
      fontSize: props.theme.global.size.font[props.size],
      borderTop: props.theme.filter.dropdown.borderItems,
      borderColor: selectColor(
        props.theme.filter.dropdown.borderColor,
        props.theme
      ),
      height: props.itemHeight,
    },
  };
})`
  position: absolute;
  padding-left: 0.8em;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100;
  display: flex;
  align-items: center;
`;

const NextButton = styled.div`
  position: absolute;
  top: ${(props) => props.itemsOnPage * props.rowHeight}px;
  padding: 6px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid var(--oc-gray-6);
  &:hover {
    background-color: var(--oc-gray-1);
  }
`;

const PrevButton = styled.div`
  padding: 6px;
  margin: 2px 10px;
  display: inline-block;
  border-radius: 6px;
  border: 1px solid var(--oc-gray-6);
  &:hover {
    background-color: var(--oc-gray-1);
  }
`;

FilterWrapper.defaultProps = {};
Object.setPrototypeOf(FilterWrapper.defaultProps, defaultProps);

FilterWrapperNoData.defaultProps = {};
Object.setPrototypeOf(FilterWrapperNoData.defaultProps, defaultProps);

FilterTitle.defaultProps = {};
Object.setPrototypeOf(FilterTitle.defaultProps, defaultProps);

FilterTitleDim.defaultProps = {};
Object.setPrototypeOf(FilterTitleDim.defaultProps, defaultProps);

FilterTitleItems.defaultProps = {};
Object.setPrototypeOf(FilterTitleItems.defaultProps, defaultProps);

FilterList.defaultProps = {};
Object.setPrototypeOf(FilterList.defaultProps, defaultProps);

ChevronUpIcon.defaultProps = {};
Object.setPrototypeOf(ChevronUpIcon.defaultProps, defaultProps);

ChevronDownIcon.defaultProps = {};
Object.setPrototypeOf(ChevronDownIcon.defaultProps, defaultProps);

FilterSearchGroup.defaultProps = {};
Object.setPrototypeOf(FilterSearchGroup.defaultProps, defaultProps);

SearchStyle.defaultProps = {};
Object.setPrototypeOf(SearchStyle.defaultProps, defaultProps);

FilterSearch.defaultProps = {};
Object.setPrototypeOf(FilterSearch.defaultProps, defaultProps);

XStyle.defaultProps = {};
Object.setPrototypeOf(XStyle.defaultProps, defaultProps);

StyledFilterListItem.defaultProps = {};
Object.setPrototypeOf(StyledFilterListItem.defaultProps, defaultProps);

NextButton.defaultProps = {};
Object.setPrototypeOf(NextButton.defaultProps, defaultProps);

PrevButton.defaultProps = {};
Object.setPrototypeOf(PrevButton.defaultProps, defaultProps);

export {
  FilterWrapper,
  FilterWrapperNoData,
  FilterTitle,
  FilterTitleDim,
  FilterTitleItems,
  FilterList,
  ChevronUpIcon,
  ChevronDownIcon,
  FilterSearchGroup,
  SearchStyle,
  FilterSearch,
  XStyle,
  StyledFilterListItem,
  NextButton,
  PrevButton,
};
