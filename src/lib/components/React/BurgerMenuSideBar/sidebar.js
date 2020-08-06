import React from "react";
import { slide as SlideMenu } from "../BurgerMenu";
import { stack as StackMenu } from "../BurgerMenu";
import { elastic as ElasticMenu } from "../BurgerMenu";
import { bubble as BubbleMenu } from "../BurgerMenu";
import { push as PushMenu } from "../BurgerMenu";
import { pushRotate as PushRotateMenu } from "../BurgerMenu";
import { scaleDown as ScaleDownMenu } from "../BurgerMenu";
import { scaleRotate as ScaleRotateMenu } from "../BurgerMenu";
import { fallDown as FallDownMenu } from "../BurgerMenu";
import { reveal as RevealMenu } from "../BurgerMenu";
import "./styles.css";

export default (props) => {
  return (
    <>
      {
        {
          slide: <SlideMenu {...props}>{props.children}</SlideMenu>,
          stack: <StackMenu {...props}>{props.children}</StackMenu>,
          elastic: <ElasticMenu {...props}>{props.children}</ElasticMenu>,
          bubble: <BubbleMenu {...props}>{props.children}</BubbleMenu>,
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
