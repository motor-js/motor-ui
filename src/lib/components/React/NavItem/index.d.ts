import * as React from "react";

export interface ModalProps {
  children: React.ReactNode
  footer: React.ReactNode
  header: React.ReactNode
  width: '10%' | '20%' | '30%' | '40%' | '50%' | '60%' | '70%' | '80%' | '90%' | '100%' | 
    '10vw' | '20vw' | '30vw' | '40vw' | '50vw' | '60vw' | '70vw' | '80vw' | '90vw' | '10vw'
  zIndex: string
}

declare const Modal: React.FC<ModalProps>;

export type ModalType = ModalProps

export default Modal