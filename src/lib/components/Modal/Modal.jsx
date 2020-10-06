import React, { useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Box from "../box";
import useOutsideClick from "../../../hooks/useOutsideClick";

import {
  ModalWrapper,
  ModalOverlay,
  ModalMain,
  //  ModalHeader,
  //  ModalBody,
  //  ModalFooter,
} from "./ModalTheme";

const Modal = ({
  isShowing,
  children,
  header,
  footer,
  width,
  top,
  zIndex,
  onOutsideClick,
  ...rest
}) => {
  const ref = useRef();
  const numWidth = Number(width.replace("%", "").replace("vw", ""));

  useOutsideClick(ref, () => {
    if (isShowing) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick) onOutsideClick();
    }
  });

  return isShowing
    ? ReactDOM.createPortal(
        <>
          <ModalOverlay>
            <ModalWrapper
              width={width}
              numWidth={numWidth}
              top={top}
              zIndex={zIndex}
              ref={ref}
            >
              <Box
                focusable={false}
                padding="24px"
                width="100%"
                border="bottom"
              >
                {header}
              </Box>
              <ModalMain>{children}</ModalMain>
              <Box
                focusable={false}
                padding="14px 24px"
                width="100%"
                border="top"
              >
                {footer}
              </Box>
            </ModalWrapper>
          </ModalOverlay>
        </>,
        document.body
      )
    : null;
};

Modal.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.node,
  header: PropTypes.node,
  width: PropTypes.oneOf([
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
    "10vw",
    "20vw",
    "30vw",
    "40vw",
    "50vw",
    "60vw",
    "70vw",
    "80vw",
    "90vw",
    "10vw",
  ]),
  zIndex: PropTypes.string,
};

Modal.defaultProps = {
  children: undefined,
  footer: undefined,
  header: undefined,
  width: "70vw",
  top: "30%",
  zIndex: "1050",
};

export default Modal;
