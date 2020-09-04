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
} from "@vx/gradient";

function Gradient({ style, id, from, to }) {
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
  return Gradient ? <Gradient id={id} from={from} to={to} /> : null;
}

export default Gradient;
