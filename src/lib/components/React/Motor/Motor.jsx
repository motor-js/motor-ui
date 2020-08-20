import React, { useState } from "react";
import { ThemeContext } from "../../../contexts/ThemeProvider";
import { EngineContext } from "../../../contexts/EngineProvider";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import { deepMerge } from "../../../utils/object";
import defaultTheme from "../../../themes/defaultTheme";
import Login from "../Login";
import NotConnected from "../NotConnected";

function Motor({ children, theme, config, engine }) {
  const [myTheme, setMyTheme] = useState(defaultTheme);
  const [myConfig, setMyConfig] = useState(config);

  const nextTheme = deepMerge(myTheme, theme);

  // eslint-disable-next-line react/react-in-jsx-scope
  return (
    <EngineContext.Provider value={engine}>
      <ConfigContext.Provider value={myConfig}>
        <ThemeContext.Provider value={nextTheme}>
          <Login />
          <NotConnected />
          {children}
        </ThemeContext.Provider>
      </ConfigContext.Provider>
    </EngineContext.Provider>
  );
}

export default Motor;
