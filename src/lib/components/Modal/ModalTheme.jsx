import styled from "styled-components";
import { globalStyle } from "../../utils/styles";
import { defaultProps } from "../../default-props";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(105, 105, 105, 0.8);
`;
const ModalWrapper = styled.div`
  ${globalStyle};
  position: fixed;
  z-index: ${(props) => props.zIndex};
  background-color: white;
  width: ${(props) => props.width};
  border-radius: 8px;
  box-shadow: 1px 1px 1px var(--oc-grey-6);
  left: ${(props) => (100 - props.numWidth) / 2}%;
  top: ${(props) => props.top};
  box-sizing: border-box;
`;

const ModalMain = styled.div`
  position: relative;
  margin: 0.2;
  opacity: 1;
  padding: 24px;
`;

ModalOverlay.defaultProps = {};
Object.setPrototypeOf(ModalOverlay.defaultProps, defaultProps);

ModalWrapper.defaultProps = {};
Object.setPrototypeOf(ModalWrapper.defaultProps, defaultProps);

ModalMain.defaultProps = {};
Object.setPrototypeOf(ModalMain.defaultProps, defaultProps);

/*
const ModalHeader = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--oc-gray-4);
`

const ModalBody = styled.div`
  width: 100%;
  height: 100%;
  background-color: 'red';
`

const ModalFooter = styled.div`
  width: 100%;
  height: 40px;
  background-color: 'blue';
`
*/
export {
  ModalWrapper,
  ModalOverlay,
  ModalMain,
  // ModalHeader,
  // ModalBody,
  // ModalFooter,
};
