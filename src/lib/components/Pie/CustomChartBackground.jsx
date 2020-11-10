import React, { useContext } from "react";
import {
  LinearGradient,
  RadialGradient,
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
} from "@visx/gradient";

import { DataContext } from "../visx";

const backgroundId = "visx-background-gradient";

function Gradient({ style, from, to }) {
  const { width, height } = useContext(DataContext);

  let Gradient = null;

  switch (style) {
    case "Linear":
      Gradient = LinearGradient;
      break;
    case "Radial":
      Gradient = RadialGradient;
      break;
    case "DarkGreen":
      Gradient = GradientDarkgreenGreen;
      break;
    case "LightGreen":
      Gradient = GradientLightgreenGreen;
      break;
    case "OrangeRed":
      Gradient = GradientOrangeRed;
      break;
    case "PinkBlue":
      Gradient = GradientPinkBlue;
      break;
    case "PinkRed":
      Gradient = GradientPinkRed;
      break;
    case "PurpleOrangle":
      Gradient = GradientPurpleOrange;
      break;
    case "PurpleRed":
      Gradient = GradientPurpleRed;
      break;
    case "PurpleTeal":
      Gradient = GradientPurpleTeal;
      break;
    case "SteelPurple":
      Gradient = GradientSteelPurple;
      break;
    case "TealBlue":
      Gradient = GradientTealBlue;
      break;
    default:
      Gradient = null;
      break;
  }
  return Gradient ? (
    <>
      <Gradient id={backgroundId} from={from} to={to} />{" "}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#visx-background-gradient)"
        rx={14}
      />
    </>
  ) : null;
}

export default Gradient;
