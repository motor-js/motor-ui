import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import StyledSelectionModal from './StyledSelectionModal';
import defaultTheme from '../../../themes/defaultTheme';

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
  hoverBckgColorConfirm,
  hoverBckgColorCancel,
  borderConfirm,
  borderCancel,
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
      hoverBckgColorConfirm={hoverBckgColorConfirm}
      hoverBckgColorCancel={hoverBckgColorCancel}
      borderConfirm={borderConfirm}
      borderCancel={borderCancel}
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
  buttonType: PropTypes.oneOf(['icon', 'text']),
  hoverBckgColorConfirm: PropTypes.string,
  bckgColorCancel: PropTypes.string,
  bckgColorConfirm: PropTypes.string,
  hoverBckgColorCancel: PropTypes.string,
  borderConfirm: PropTypes.string,
  borderCancel: PropTypes.string,
  colorConfirm: PropTypes.string,
  colorCancel: PropTypes.string,
};

SelectionModal.defaultProps = {
  confirmCallback: () => {},
  cancelCallback: () => {},
  isOpen: false,
  margin: '0',
  offset: -36,
  width: '100%',
  // buttonType: 'icon',
};

export default SelectionModal;
