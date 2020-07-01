import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  SelectionModalWrapper,
  SelectionModalButton,
  SelectionModalButtonConfirm,
  SelectionModalButtonCancel,
} from './SelectionModalTheme';
// import useOutsideClick from '../../Hooks/useOutsideClick'
import { ThemeContext } from 'styled-components';
import { Check, X } from 'react-feather';
import defaultTheme from '../../../themes/defaultTheme';

function StyledSelectionModal({
  confirmCallback,
  cancelCallback,
  isOpen,
  margin,
  offset,
  width,
  buttonType,
  hoverBckgColorConfirm,
  hoverBckgColorCancel,
  bckgColorConfirm,
  bckgColorCancel,
  borderConfirm,
  borderCancel,
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
          width={width}
          margin={margin}
        >
          <SelectionModalButtonCancel
            theme={theme}
            type='button'
            className='cancelSelections'
            bckgColor={bckgColorCancel}
            border={borderCancel}
            color={colorCancel}
            hoverbckgColor={hoverBckgColorCancel}
            onClick={cancelSelections}
          >
            {buttonType || theme.selectionModal.buttonType === 'icon' ? (
              <X className='cancelSelections' />
            ) : (
              <div className='cancelSelections'>CANCEL</div>
            )}
          </SelectionModalButtonCancel>
          <SelectionModalButtonConfirm
            type='button'
            className='confirmSelections'
            bckgColor={bckgColorConfirm}
            border={borderConfirm}
            color={colorConfirm}
            hoverbckgColor={hoverBckgColorConfirm}
            onClick={confirmSelections}
          >
            {buttonType || theme.selectionModal.buttonType === 'icon' ? (
              <Check />
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
