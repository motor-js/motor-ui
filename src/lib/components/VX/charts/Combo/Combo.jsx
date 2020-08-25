import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledCombo from "./StyledCombo";
import { ConfigContext } from "../../../../contexts/ConfigProvider";
import defaultTheme from "../../../../themes/defaultTheme";
// import { EngineContext } from "../../../contexts/EngineProvider";
import { EngineContext } from "../../../../contexts/EngineProvider";
import useEngine from "../../../../hooks/useEngine";

function Combo({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledCombo
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

Combo.propTypes = {};

Combo.defaultProps = {
  width: "100%",
  height: 400,
};

export default Combo;
