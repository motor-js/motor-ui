import * as React from "react";

export interface SelectionModalProps {
  confirmCallback: () => {};
  cancelCallback: () => {};
  isOpen: boolean;
  margin: string;
  offset: number;
  width: string;
  buttonType: "icon" | "text";
  hoverOpacityConfirm: string;
  bckgColorCancel: string;
  bckgColorConfirm: string;
  hoverOpacityCancel: string;
  borderColorConfirm: string;
  borderColorCancel: string;
  borderSizeConfirm: string;
  borderSizeCancel: string;
  borderStyleConfirm: string;
  borderStyleCancel: string;
  borderRadiusConfirm: string;
  borderRadiusCancel: string;
  colorConfirm: string;
  colorCancel: string;
}

declare const SelectionModal: React.FC<SelectionModalProps>;

export type SelectionModalType = SelectionModalProps;

export default SelectionModal;
