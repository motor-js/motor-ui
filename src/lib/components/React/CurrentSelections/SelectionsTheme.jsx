import styled, { css } from "styled-components";
import { Times } from "@styled-icons/fa-solid/Times";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const overflowStyles = css`
  overflow-x-: ${(props) => (props.overflow === "x-axis" ? "scroll" : "auto")};
  overflow-y ${(props) => (props.overflow === "x-axis" ? "auto" : "scroll")};
  flex-wrap: ${(props) => (props.overflow === "x-axis" ? "nowrap" : "wrap")};
`;

const SelectionsWrapper = styled.div`
  ${globalStyle};
  ${overflowStyles};
  ${(props) => props.gridArea && `grid-area: ${props.gridArea};`};
  max-height: ${(props) => props.maxHeight};
  min-height: ${(props) => props.minHeight};
  margin: ${(props) => props.margin || props.theme.selections.wrapper.margin};
  display: flex;
  flex: ${(props) => props.flex};
  align-items: flex-start;
  align-content: flex-start;
  max-width: ${(props) => (props.gridArea ? null : props.width)};
  border: ${(props) => props.theme.selections.wrapper.border};
  border-radius: ${(props) => props.theme.selections.wrapper.radius};
  background-color: ${(props) =>
    selectColor(props.theme.selections.wrapper.backgroundColor, props.theme)};
  border-color: ${(props) =>
    selectColor(props.theme.selections.wrapper.borderColor, props.theme)};
`;

const SelectionItem = styled.span`
  ${globalStyle};
  margin: 4px;
  text-align: center;
  padding: 8px;
  align-items: center;
  display: flex;
  flex-wrap: no-wrap;
  white-space: nowrap;
  border: ${(props) => props.theme.selections.item.border};
  border-color:  ${(props) =>
    selectColor(props.theme.selections.color.border, props.theme)}; 
  border-radius: ${(props) => props.theme.selections.item.radius};
  background-color: ${(props) =>
    selectColor(props.theme.selections.item.backgroundColor, props.theme)};
  cursor: default;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
`;

const NoSelections = styled.div`
  margin: 10px;
  color: ${(props) =>
    selectColor(props.theme.selections.color.defaultFont, props.theme)};
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
`;

const SelectedTitle = styled.span`
  margin: 0 0 0 5px;
  color: ${(props) =>
    selectColor(props.theme.selections.color.fontTitle, props.theme)};
  font-weight:  ${(props) => props.theme.selections.item.titleFontWeight};
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
`;

const SelectedValue = styled.span`
  color: ${(props) =>
    selectColor(props.theme.selections.color.item, props.theme)};
  text-align: top;
`;

const SelectionsX = styled.span`
  cursor: pointer;
  border-radius: 50%;
  margin-left: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${(props) =>
      selectColor(props.theme.selections.item.backgroundColor, props.theme)};
`;

/*
  &:hover {
    border: 1px solid
      ${(props) => selectColor(props.theme.selections.color.clear, props.theme)};
  }
  
*/
const XStyled = styled(Times)`
  padding: 1px 1px;
  color: ${(props) =>
    selectColor(props.theme.selections.color.clear, props.theme)};
`;

SelectionsWrapper.defaultProps = {};
Object.setPrototypeOf(SelectionsWrapper.defaultProps, defaultProps);

SelectionItem.defaultProps = {};
Object.setPrototypeOf(SelectionItem.defaultProps, defaultProps);

NoSelections.defaultProps = {};
Object.setPrototypeOf(NoSelections.defaultProps, defaultProps);

SelectedTitle.defaultProps = {};
Object.setPrototypeOf(SelectedTitle.defaultProps, defaultProps);

SelectedValue.defaultProps = {};
Object.setPrototypeOf(SelectedValue.defaultProps, defaultProps);

SelectionsX.defaultProps = {};
Object.setPrototypeOf(SelectionsX.defaultProps, defaultProps);

XStyled.defaultProps = {};
Object.setPrototypeOf(SelectionsX.defaultProps, defaultProps);

export {
  SelectionsWrapper,
  SelectionItem,
  NoSelections,
  SelectedTitle,
  SelectedValue,
  SelectionsX,
  XStyled,
};
