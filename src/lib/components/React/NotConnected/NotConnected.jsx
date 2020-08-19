import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import StyledNotConnected from "./StyledNotConnected";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";
import { NotConnectedWrapper } from "./NotConnectedTheme";

const NotConnected = ({ config, ...rest }) => {
  const myConfig = config || useContext(ConfigContext);
  const myTheme = useContext(ThemeContext) || defaultTheme;
  const { errorCode } = useContext(EngineContext) || useEngine(myConfig);

  return (
    <NotConnectedWrapper errorCode={errorCode}>
      {myConfig && errorCode && (
        <StyledNotConnected theme={myTheme} {...rest} />
      )}
    </NotConnectedWrapper>
  );
};

NotConnected.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  buttonText: PropTypes.string,
  backgroundColor: PropTypes.string,
  buttonFontColor: PropTypes.string,
  buttonColor: PropTypes.string,
};

export default NotConnected;
