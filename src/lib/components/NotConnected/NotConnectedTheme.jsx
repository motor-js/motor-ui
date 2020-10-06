import styled from "styled-components";
import { globalStyle } from "../../utils/styles";
import { defaultProps } from "../../default-props";

const NotConnectedOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(105, 105, 105, 0.8);
  display: flex;
`;

const NotConnectedBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  margin: 0.2;
  padding: 5px;
  background-color: ${(props) => props.color};
  border: 1px solid gray;
  border-radius: 8px;
  width: 30%;
  min-width: 350px;
  top: 30%;
  left: 35%;
  align-self: flex-start;
`;

const NotConnectedWrapper = styled.div`
  display: ${(props) => (props.errorCode === -3 ? "" : "none")};
`;

const NotConnectedHeader = styled.div`
  ${globalStyle};
  padding: 0.8rem;
  font-size: ${(props) => props.theme.global.size.title[props.size]};
`;

const NotConnectedText = styled.div`
  ${globalStyle};
  padding: 0.6rem;
`;

NotConnectedOverlay.defaultProps = {};
Object.setPrototypeOf(NotConnectedOverlay.defaultProps, defaultProps);

NotConnectedBox.defaultProps = {};
Object.setPrototypeOf(NotConnectedBox.defaultProps, defaultProps);

NotConnectedWrapper.defaultProps = {};
Object.setPrototypeOf(NotConnectedWrapper.defaultProps, defaultProps);

NotConnectedText.defaultProps = {};
Object.setPrototypeOf(NotConnectedText.defaultProps, defaultProps);

NotConnectedHeader.defaultProps = {};
Object.setPrototypeOf(NotConnectedHeader.defaultProps, defaultProps);

export {
  NotConnectedOverlay,
  NotConnectedBox,
  NotConnectedWrapper,
  NotConnectedText,
  NotConnectedHeader,
};
