import React, { useRef, useContext } from "react";
import PropTypes from "prop-types";
import {
  SelectionModalWrapper,
  SelectionModalButtonConfirm,
  SelectionModalButtonCancel,
} from "./SelectionModalTheme";
// import useOutsideClick from '../../Hooks/useOutsideClick'
import { ThemeContext } from "styled-components";
import { Check, Times } from "@styled-icons/fa-solid";
import defaultTheme from "../../themes/defaultTheme";

function StyledSelectionModal({
  confirmCallback,
  cancelCallback,
  isOpen,
  margin,
  offset,
  offsetX,
  width,
  buttonType,
  hoverOpacityConfirm,
  hoverOpacityCancel,
  bckgColorConfirm,
  bckgColorCancel,
  borderColorConfirm,
  borderColorCancel,
  borderSizeConfirm,
  borderSizeCancel,
  borderStyleConfirm,
  borderStyleCancel,
  borderRadiusConfirm,
  borderRadiusCancel,
  colorConfirm,
  colorCancel,
}) {
  // Ref
  const ref = useRef();

  const theme = useContext(ThemeContext) || defaultTheme;

  const confirmSelections = () => {
    confirmCallback();
  };

  const cancelSelections = () => {
    cancelCallback();
  };

  return (
    <>
      {isOpen && (
        <SelectionModalWrapper
          ref={ref}
          offset={offset}
          offsetX={offsetX}
          width={width}
          margin={margin}
        >
          <SelectionModalButtonCancel
            theme={theme}
            type="button"
            className="cancelSelections"
            bckgColor={bckgColorCancel}
            borderColor={borderColorCancel}
            borderSize={borderSizeCancel}
            borderStyle={borderStyleCancel}
            borderRadius={borderRadiusCancel}
            color={colorCancel}
            hoverOpacity={hoverOpacityCancel}
            onClick={cancelSelections}
          >
            {buttonType || theme.selectionModal.buttonType === "icon" ? (
              <Times className="cancelSelections" size={20} />
            ) : (
              <div className="cancelSelections">CANCEL</div>
            )}
          </SelectionModalButtonCancel>
          <SelectionModalButtonConfirm
            type="button"
            className="confirmSelections"
            bckgColor={bckgColorConfirm}
            borderColor={borderColorConfirm}
            borderSize={borderSizeConfirm}
            borderStyle={borderStyleConfirm}
            borderRadius={borderRadiusConfirm}
            color={colorConfirm}
            hoverOpacity={hoverOpacityConfirm}
            onClick={confirmSelections}
          >
            {buttonType || theme.selectionModal.buttonType === "icon" ? (
              <Check size={20} />
            ) : (
              <div>CONFIRM</div>
            )}
          </SelectionModalButtonConfirm>
        </SelectionModalWrapper>
      )}
    </>
  );
}

export default StyledSelectionModal;
