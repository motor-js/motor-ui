import styled from 'styled-components'
import { globalStyle } from '../../../utils/styles'
import { defaultProps } from '../../../default-props'

const LoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(105,105,105,0.8);
  display: flex;
`

const LoginBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  margin: 0.2;
  padding: 5px;
  background-color: ${props => props.color};
  border: 1px solid gray;
  border-radius: 8px;
  width: 30%;
  min-width: 350px;
  top: 30%;
  left: 35%;
  align-self: flex-start;  
`

const LoginWrapper = styled.div`
  display: ${props => (props.errorCode === -1 ? '' : 'none')}
`

const LoginHeader = styled.div`
  ${globalStyle};
  padding: 0.6rem;
  font-size: ${props => props.theme.global.size.title[props.size]}
`

const LoginText = styled.div`
  ${globalStyle};
  padding: 0.6rem;
`

LoginOverlay.defaultProps = {}
Object.setPrototypeOf(LoginOverlay.defaultProps, defaultProps)

LoginBox.defaultProps = {}
Object.setPrototypeOf(LoginBox.defaultProps, defaultProps)

LoginWrapper.defaultProps = {}
Object.setPrototypeOf(LoginWrapper.defaultProps, defaultProps)

LoginText.defaultProps = {}
Object.setPrototypeOf(LoginText.defaultProps, defaultProps)

LoginHeader.defaultProps = {}
Object.setPrototypeOf(LoginHeader.defaultProps, defaultProps)

export {
  LoginOverlay,
  LoginBox,
  LoginWrapper,
  LoginText,
  LoginHeader,
}
