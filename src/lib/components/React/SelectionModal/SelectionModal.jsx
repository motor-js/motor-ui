import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledSelectionModal from "./StyledSelectionModal";
import defaultTheme from "../../../themes/defaultTheme";

function SelectionModal({
  confirmCallback,
  cancelCallback,
  isOpen,
  margin,
  offset,
  width,
  buttonType,
  bckgColorConfirm,
  bckgColorCancel,
  hoverOpacityConfirm,
  hoverOpacityCancel,
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
  const myTheme = useContext(ThemeContext) || defaultTheme;

  return (
    <StyledSelectionModal
      theme={myTheme}
      confirmCallback={confirmCallback}
      cancelCallback={cancelCallback}
      isOpen={isOpen}
      margin={margin}
      offset={offset}
      width={width}
      buttonType={buttonType}
      bckgColorConfirm={bckgColorConfirm}
      bckgColorCancel={bckgColorCancel}
      hoverOpacityConfirm={hoverOpacityConfirm}
      hoverOpacityCancel={hoverOpacityCancel}
      borderColorConfirm={borderColorConfirm}
      borderColorCancel={borderColorCancel}
      borderSizeConfirm={borderSizeConfirm}
      borderSizeCancel={borderSizeCancel}
      borderStyleConfirm={borderStyleConfirm}
      borderStyleCancel={borderStyleCancel}
      borderRadiusConfirm={borderRadiusConfirm}
      borderRadiusCancel={borderRadiusCancel}
      colorConfirm={colorConfirm}
      colorCancel={colorCancel}
    />
  );
}

SelectionModal.propTypes = {
  confirmCallback: PropTypes.func,
  cancelCallback: PropTypes.func,
  isOpen: PropTypes.bool,
  margin: PropTypes.string,
  offset: PropTypes.number,
  width: PropTypes.string,
  buttonType: PropTypes.oneOf(["icon", "text"]),
  hoverOpacityConfirm: PropTypes.string,
  bckgColorCancel: PropTypes.string,
  bckgColorConfirm: PropTypes.string,
  hoverOpacityCancel: PropTypes.string,
  borderColorConfirm: PropTypes.string,
  borderColorCancel: PropTypes.string,
  borderSizeConfirm: PropTypes.string,
  borderSizeCancel: PropTypes.string,
  borderStyleConfirm: PropTypes.string,
  borderStyleCancel: PropTypes.string,
  borderRadiusConfirm: PropTypes.string,
  borderRadiusCancel: PropTypes.string,
  colorConfirm: PropTypes.string,
  colorCancel: PropTypes.string,
};

SelectionModal.defaultProps = {
  confirmCallback: () => {},
  cancelCallback: () => {},
  isOpen: false,
  margin: "0",
  offset: -36,
  width: "100%",
  // buttonType: 'icon',
};

export default SelectionModal;
