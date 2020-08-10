import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledBar from "./StyledBar";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Bar({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledBar
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

Bar.propTypes = {};

Bar.defaultProps = {
  width: 700,
  height: 400,
};

export default Bar;
