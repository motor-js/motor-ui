import styled from "styled-components";
import { globalStyle } from "../../../utils/styles";
import { defaultProps } from "../../../default-props";
import { Download, FileDownload, FilePdf, FileImage } from '@styled-icons/fa-solid'

const StyledMenu = styled.ul`
  ${globalStyle};
  top: ${props => props.top};
  left: ${props => props.left};
  margin-top: 10px;
  background-color: white;
  border: 1px solid var(--oc-gray-1);
  border-radius: 8px;
  z-index: 1000;
  width: 120px;
  position: absolute;
  -moz-box-shadow: 10px 10px 5px var(--oc-gray-1);
  -webkit-box-shadow: 10px 10px 5px var(--oc-gray-1);
  box-shadow: 10px 10px 5px var(--oc-gray-1);
  display: flex;
  flex-direction: column;
`

const StyledListItem = styled.ul`
  padding: 10px;
  list-style-type: none;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  margin: 0;
  &:hover {
    background: var(--oc-gray-2);
  }
`

const StyledDownload = styled(Download)`
  height: 14px;
  margin: 0px 5px;
`

const StyledFileDownload = styled(FileDownload)`
  height: 10px;
`

const StyledFilePdf = styled(FilePdf)`
  height: 10px;
`

const StyledFileImage = styled(FileImage)`
  height: 10px;
`

StyledMenu.defaultProps = {};
Object.setPrototypeOf(StyledMenu.defaultProps, defaultProps);

StyledListItem.defaultProps = {};
Object.setPrototypeOf(StyledListItem.defaultProps, defaultProps);

StyledDownload.defaultProps = {};
Object.setPrototypeOf(StyledDownload.defaultProps, defaultProps);

StyledFileDownload.defaultProps = {};
Object.setPrototypeOf(StyledFileDownload.defaultProps, defaultProps);

StyledFilePdf.defaultProps = {};
Object.setPrototypeOf(StyledFilePdf.defaultProps, defaultProps);

StyledFileImage.defaultProps = {};
Object.setPrototypeOf(StyledFileImage.defaultProps, defaultProps);

export {
  StyledMenu,
  StyledListItem,
  StyledDownload,
  StyledFileDownload,
  StyledFilePdf,
  StyledFileImage,
}