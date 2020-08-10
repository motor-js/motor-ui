import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledBarSeries from "./StyledBarSeries";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function BarSeries({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledBarSeries
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

BarSeries.propTypes = {};

BarSeries.defaultProps = {
  width: 700,
  height: 400,
};

export default BarSeries;
