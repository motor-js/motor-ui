import React from "react";
import { ButtonWrapper } from "./ButtonTheme";

const StyledButton = ({
  children,
  engine,
  type,
  block,
  onClick,
  size,
  color,
  margin,
  width,
  fontColor,
  borderRadius,
  border,
  outline,
  activeTransform,
  activeBackgroundColor,
  activeBackgroundSize,
  activeTransition,
  transition,
  hoverBoxShadow,
  hoverBorder,
  hoverBackground,
  disabled,
}) => {
  const action = async (e) => {
    onClick(e);
    switch (type) {
      case "clearSelections":
        if (engine) {
          await engine.abortModal(true);
          engine.clearAll();
        }
        break;
      case "back":
        if (engine) {
          await engine.abortModal(true);
          engine.back();
        }
        break;
      case "forward":
        if (engine) {
          await engine.abortModal(true);
          engine.forward();
        }
        break;
      case "default": {
      }
      default:
        break;
    }
  };

  return (
    <>
      <ButtonWrapper
        data-testid="button"
        type="button"
        size={size}
        block={block}
        color={color}
        margin={margin}
        disabled={disabled}
        width={width}
        fontColor={fontColor}
        borderRadius={borderRadius}
        border={border}
        outline={outline}
        activeTransform={activeTransform}
        activeBackgroundColor={activeBackgroundColor}
        activeBackgroundSize={activeBackgroundSize}
        activeTransition={activeTransition}
        transition={transition}
        hoverBoxShadow={hoverBoxShadow}
        hoverBorder={hoverBorder}
        hoverBackground={hoverBackground}
        onClick={(e) => action(e)}
      >
        {children}
      </ButtonWrapper>
    </>
  );
};

export default StyledButton;
