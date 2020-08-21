import styled from "styled-components";
import { defaultProps } from "../../../default-props";
import { globalStyle } from "../../../utils/styles";
import { selectColor } from "../../../utils/colors";

const SelectionModalWrapper = styled.div`
  ${globalStyle}
  margin: ${(props) => props.margin};
  top: ${(props) => `${props.offset}px`};
  width: ${(props) => props.width};
  position: absolute;
  z-index: 100;
  box-sizing: border-box;
  border: 1px solid #CCCCCC;
  background-color: white;
  display: flex;
  justify-content: flex-end;
`;

const SelectionModalButton = styled.button`
  height: 25px;
  padding: 0 12px;
  margin: 5px 5px;
  font-weight: bold;
  font-size: 12px;
  text-decoration: none;
  position: relative;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
  align-items: center;
`;

const SelectionModalButtonConfirm = styled(SelectionModalButton)`
  background-color: ${(props) =>
    selectColor(
      props.bckgColor || props.theme.selectionModal.bckgColor.confirm,
      props.theme
    )};
  border: ${(props) =>
    selectColor(
      props.border || props.theme.selectionModal.border.confirm,
      props.theme
    )};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.selectionModal.color.confirm,
      props.theme
    )};

  &:hover {
    opacity: ${(props) =>
      props.opacity || props.theme.selectionModal.hoverOpacity.confirm};
  }
`;
const SelectionModalButtonCancel = styled(SelectionModalButton)`
  background-color: ${(props) =>
    selectColor(
      props.bckgColor || props.theme.selectionModal.bckgColor.cancel,
      props.theme
    )};
  border: ${(props) =>
    selectColor(
      props.border || props.theme.selectionModal.border.cancel,
      props.theme
    )};
  color: ${(props) =>
    selectColor(
      props.color || props.theme.selectionModal.color.cancel,
      props.theme
    )};

  &:hover {
    opacity: ${(props) =>
      props.opacity || props.theme.selectionModal.hoverOpacity.cancel};
  }
`;

SelectionModalWrapper.defaultProps = {};
Object.setPrototypeOf(SelectionModalWrapper.defaultProps, defaultProps);

SelectionModalButton.defaultProps = {};
Object.setPrototypeOf(SelectionModalButton.defaultProps, defaultProps);

SelectionModalButtonConfirm.defaultProps = {};
Object.setPrototypeOf(SelectionModalButtonConfirm.defaultProps, defaultProps);

SelectionModalButtonCancel.defaultProps = {};
Object.setPrototypeOf(SelectionModalButtonCancel.defaultProps, defaultProps);

export {
  SelectionModalWrapper,
  SelectionModalButton,
  SelectionModalButtonConfirm,
  SelectionModalButtonCancel,
};
