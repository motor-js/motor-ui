import styled from "styled-components";
import { Search } from "@styled-icons/feather/Search";
import { X } from "@styled-icons/feather/X";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { selectColor } from "../../../utils/colors";

const SearchWrapper = styled.div`
  ${globalStyle};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
  display: flex;
  flex-direction: column;
  position: relative;
`;
const SearchBar = styled.div`
  border: ${(props) => props.theme.search.title.border};
  border-color: ${(props) =>
    selectColor(props.theme.search.title.borderColor, props.theme)};
  border-radius: ${(props) => props.theme.search.title.radius};
  background-color: ${(props) =>
    selectColor(props.theme.search.color.background, props.theme)};
  width: 100%;
  height: 100%;
  padding: 0.7em 0 0.7em 0em;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  ${globalStyle};
  width: 85%;
  height: 100%;
  outline: none;
  border: none;
  padding-left: 0.7em;
  background-color: ${(props) =>
    selectColor(props.theme.search.color.background, props.theme)};
  color: ${(props) => selectColor(props.theme.search.color.font, props.theme)};
  &::placeholder {
    color: ${(props) =>
      selectColor(props.theme.search.color.placeholder, props.theme)};
  }
`;

const SearchIcon = styled(Search)`
  padding-left: 1em;
  color: ${(props) => selectColor(props.theme.search.color.icon, props.theme)};
`;

const XIcon = styled(X)`
  padding-right: 0.5em;
  cursor: pointer;
  color: ${(props) => selectColor(props.theme.search.color.icon, props.theme)};
`;

const SuggestionsWrapper = styled.div`
  width: 100%;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0px;
  margin-top: 2px;
  border: ${(props) => props.theme.search.title.border};
  border-color: ${(props) =>
    selectColor(props.theme.search.title.borderColor, props.theme)};
  border-radius: ${(props) => props.theme.search.title.radius};
  z-index: 100;
  background-color: ${(props) =>
    selectColor(props.theme.search.color.background, props.theme)};
  max-height: ${(props) => props.dropHeight};
  overflow: auto;
  cursor: normal;
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  position: absolute;
  width: 100%; 
`;

const SuggestionsItem = styled.li`
  padding: 5px;
  cursor: pointer;
  border-bottom: ${(props) => props.theme.search.suggestions.borderBottom};
  &:hover {
    background-color: ${(props) =>
      selectColor(props.theme.search.suggestions.hoverColor, props.theme)};
  }
`;

const SuggestionsItemTitle = styled.div`
  font-size: ${(props) => props.theme.global.size.font[props.size]};
  padding: 2px;
  font-weight: bold;
  color: ${(props) =>
    selectColor(props.theme.search.suggestions.titleColor, props.theme)};
`;

const SuggestionsItemValues = styled.div`
  font-size: ${(props) => props.theme.global.size.font[props.size]};
  padding: 2px;
  color: ${(props) =>
    selectColor(props.theme.search.suggestions.valueColor, props.theme)};
`;

const SuggestionsItemLoad = styled.div`
  font-size: ${(props) => props.theme.global.size.subFont[props.size]};
  font-style: italic;
  text-decoration: underline;
  display: inline-block;
  &:hover {
    font-weight: bold;
    cursor: pointer;
  }
`;

SearchWrapper.defaultProps = {};
Object.setPrototypeOf(SearchWrapper.defaultProps, defaultProps);

SearchBar.defaultProps = {};
Object.setPrototypeOf(SearchBar.defaultProps, defaultProps);

SearchInput.defaultProps = {};
Object.setPrototypeOf(SearchInput.defaultProps, defaultProps);

SearchIcon.defaultProps = {};
Object.setPrototypeOf(SearchIcon.defaultProps, defaultProps);

XIcon.defaultProps = {};
Object.setPrototypeOf(XIcon.defaultProps, defaultProps);

SuggestionsWrapper.defaultProps = {};
Object.setPrototypeOf(SuggestionsWrapper.defaultProps, defaultProps);

SuggestionsList.defaultProps = {};
Object.setPrototypeOf(SuggestionsList.defaultProps, defaultProps);

SuggestionsItem.defaultProps = {};
Object.setPrototypeOf(SuggestionsItem.defaultProps, defaultProps);

SuggestionsItemLoad.defaultProps = {};
Object.setPrototypeOf(SuggestionsItemLoad.defaultProps, defaultProps);

SuggestionsItemTitle.defaultProps = {};
Object.setPrototypeOf(SuggestionsItemTitle.defaultProps, defaultProps);

SuggestionsItemValues.defaultProps = {};
Object.setPrototypeOf(SuggestionsItemValues.defaultProps, defaultProps);

export {
  SearchWrapper,
  SearchBar,
  SearchInput,
  SearchIcon,
  XIcon,
  SuggestionsWrapper,
  SuggestionsList,
  SuggestionsItem,
  SuggestionsItemTitle,
  SuggestionsItemValues,
  SuggestionsItemLoad,
};
