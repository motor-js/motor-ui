import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import defaultTheme from "../../themes/defaultTheme";

import { slide as SlideMenu } from "./menus";
import { stack as StackMenu } from "./menus";
// import { elastic as ElasticMenu } from "./menus";  // requires snapsvg-cjs in package,json :  "snapsvg-cjs": "0.0.6"
// import { bubble as BubbleMenu } from "./menus";    // requires snapsvg-cjs in package,json :  "snapsvg-cjs": "0.0.6"
import { push as PushMenu } from "./menus";
import { pushRotate as PushRotateMenu } from "./menus";
import { scaleDown as ScaleDownMenu } from "./menus";
import { scaleRotate as ScaleRotateMenu } from "./menus";
import { fallDown as FallDownMenu } from "./menus";
import { reveal as RevealMenu } from "./menus";

const SidebarNext = (props) => {
  const theme = useContext(ThemeContext) || defaultTheme;

  return (
    <>
      {
        {
          slide: <SlideMenu {...props}>{props.children}</SlideMenu>,
          stack: <StackMenu {...props}>{props.children}</StackMenu>,
          // elastic: <ElasticMenu {...props}>{props.children}</ElasticMenu>,
          // bubble: <BubbleMenu {...props}>{props.children}</BubbleMenu>,
          push: <PushMenu {...props}>{props.children}</PushMenu>,
          pushRotate: (
            <PushRotateMenu {...props}>{props.children}</PushRotateMenu>
          ),
          scaleDown: <ScaleDownMenu {...props}>{props.children}</ScaleDownMenu>,
          scaleRotate: (
            <ScaleRotateMenu {...props}>{props.children}</ScaleRotateMenu>
          ),
          fallDown: <FallDownMenu {...props}>{props.children}</FallDownMenu>,
          reveal: <RevealMenu {...props}>{props.children}</RevealMenu>,
        }[props.type || "slide"]
      }
    </>
  );
};

export default SidebarNext;
