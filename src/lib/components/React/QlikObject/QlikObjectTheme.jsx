import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { EllipsisV } from '@styled-icons/fa-solid'

const QlikWrapper = styled.div`
  ${globalStyle};
  height: ${props => props.height};
  width: ${props => props.width};
  min-width: ${props => props.minWidth};
  min-height: ${props => props.minHeight};
  margin: ${props => props.margin};
  border: ${props => props.border};
  border-radius: ${props => props.borderRadius};
  display: flex;
  padding: ${props => props.header ? `0px 10px 30px 10px;` : `30px 10px 0px 10px;`}; 
`;

const QlikHeader = styled.div`
  width: ${props => props.width};
  min-width: ${props => props.minWidth};
  height: 3rem;
  min-height: 28px;
  padding: 0px 25px 0px 10px;
  max-width: 100%;
  display: flex;
  align-items: center;

`

const StyledDots = styled(EllipsisV)`
  margin-left: auto;
  margin-right: 0px;
  height: 16px;
`

const StyledCircle = styled.div`
  margin-left: auto;  
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  vertical-align: middle;
  padding: 5px;

  &:hover {
    background: var(--oc-gray-1);
    cursor: pointer;
  }
`

const QlikHeaderText = styled.div`
  font-size: 14px;
  font-weight: bold;
`

QlikWrapper.defaultProps = {};
Object.setPrototypeOf(QlikWrapper.defaultProps, defaultProps);

QlikHeader.defaultProps = {};
Object.setPrototypeOf(QlikHeader.defaultProps, defaultProps);

QlikHeaderText.defaultProps = {};
Object.setPrototypeOf(QlikHeaderText.defaultProps, defaultProps);

StyledDots.defaultProps = {};
Object.setPrototypeOf(StyledDots.defaultProps, defaultProps);

StyledCircle.defaultProps = {};
Object.setPrototypeOf(StyledCircle.defaultProps, defaultProps);

export {
  QlikWrapper,
  QlikHeader,
  QlikHeaderText,
  StyledDots,
  StyledCircle,
}