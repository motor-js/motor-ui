import * as React from "react";

export interface SelectionModalProps {
  confirmCallback: () => {}
  cancelCallback: () => {}
  isOpen: boolean
  margin: string
  offset: number
  width: string
  buttonType: 'icon' | 'text'
  hoverBckgColorConfirm: string
  bckgColorCancel: string
  bckgColorConfirm: string
  hoverBckgColorCancel: string
  borderConfirm: string
  borderCancel: string
  colorConfirm: string
  colorCancel: string
}

declare const SelectionModal: React.FC<SelectionModalProps>;

export type SelectionModalType = SelectionModalProps

export default SelectionModal
