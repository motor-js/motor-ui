import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import StyledLogin from "./StyledLogin";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";
import { LoginWrapper } from "./LoginTheme";

const Login = ({ config, ...rest }) => {
  const myConfig = config || useContext(ConfigContext);
  const myTheme = useContext(ThemeContext) || defaultTheme;
  const { errorCode } = useContext(EngineContext) || useEngine(myConfig);

  return (
    <LoginWrapper errorCode={errorCode}>
      {myConfig && errorCode && (
        <StyledLogin config={myConfig} theme={myTheme} {...rest} />
      )}
    </LoginWrapper>
  );
};

Login.propTypes = {
  config: PropTypes.object,
  header: PropTypes.string,
  body: PropTypes.string,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  buttonText: PropTypes.string,
  backgroundColor: PropTypes.string,
  buttonFontColor: PropTypes.string,
  buttonColor: PropTypes.string,
  logo: PropTypes.string,
  logoHeight: PropTypes.string,
  logoWidth: PropTypes.string,
};

Login.defaultProps = {
  config: null,
  logo: null,
  logoHeight: null,
  logoWidth: null,
  // header: 'Welcome to your motor js mashup',
  // body: 'Please log on to access your application',
  // size: 'medium',
  // buttonText: 'Login',
  // backgroundColor: 'white',
  // buttonFontColor: 'white',
  // buttonColor: 'brand',
};

export default Login;
