/* eslint no-magic-numbers: 'off' */
import { Children } from "react";
import {
  Glyph as CustomGlyph,
  GlyphCircle,
  GlyphCross,
  GlyphDiamond,
  GlyphSquare,
  GlyphStar,
  GlyphTriangle,
  GlyphWye,
} from "@visx/glyph";

import {
  curveBasis,
  curveStep,
  curveBasisClose,
  curveBasisOpen,
  curveStepAfter,
  curveStepBefore,
  curveBundle,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveMonotoneY,
  curveCardinal,
  curveCardinalClosed,
  curveCardinalOpen,
  curveCatmullRom,
  curveCatmullRomClosed,
  curveCatmullRomOpen,
  curveNatural,
} from "@visx/curve";

export function callOrValue(maybeFn, ...args) {
  if (typeof maybeFn === "function") {
    return maybeFn(...args);
  }

  return maybeFn;
}

export function componentName(component) {
  if (component && component.type) {
    return component.type.displayName || component.type.name || "Component";
  }

  return "";
}

export function getChildWithName(name, children) {
  const ChildOfInterest = Children.toArray(children).filter(
    (c) => componentName(c) === name
  );

  return ChildOfInterest.length ? ChildOfInterest[0] : null;
}

export function isDefined(val) {
  return typeof val !== "undefined" && val !== null;
}

export function isBoolean(val) {
  return typeof val === "boolean";
}

export function valueIfUndefined(val, alternative) {
  return typeof val !== "undefined" && val !== null ? val : alternative;
}

export function isAxis(name) {
  return /axis/gi.test(name);
}

export function isBarSeries(name) {
  return /bar/gi.test(name);
}

export function isBrush(name) {
  return name === "Brush";
}

export function isCirclePackSeries(name) {
  return name === "CirclePackSeries";
}

export function isCrossHair(name) {
  return /crosshair/gi.test(name);
}

export function isReferenceLine(name) {
  return /reference/gi.test(name);
}

export function isSeries(name) {
  return /series/gi.test(name);
}

export function isStackedSeries(name) {
  return /stacked/gi.test(name);
}

export function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (height <= 600) return 5;

  return 8;
}

export function numTicksForWidth(width) {
  if (width <= 300) return 3;
  if (width <= 400) return 5;

  return 10;
}

export function propOrFallback(props, propName, fallback) {
  return props && isDefined(props[propName]) ? props[propName] : fallback;
}

export function scaleInvert(scale, value) {
  // Test if the scale is an ordinalScale or not,
  // Since an ordinalScale doesn't support invert function.
  if (!scale.invert) {
    const [start, end] = scale.range();
    let i = 0;
    const width = (scale.step() * (end - start)) / Math.abs(end - start);
    if (width > 0) {
      while (value > start + width * (i + 1)) {
        i += 1;
      }
    } else {
      while (value < start + width * (i + 1)) {
        i += 1;
      }
    }

    return i;
  }

  return scale.invert(value);
}

export function isValidNumber(_) {
  return _ != null && typeof _ === "number" && !isNaN(_) && isFinite(_);
}

export function getDomainFromExtent(scale, start, end, tolerentDelta) {
  let domain;
  const invertedStart = scaleInvert(
    scale,
    start + (start < end ? -tolerentDelta : tolerentDelta)
  );
  const invertedEnd = scaleInvert(
    scale,
    end + (end < start ? -tolerentDelta : tolerentDelta)
  );
  const minValue = Math.min(invertedStart, invertedEnd);
  const maxValue = Math.max(invertedStart, invertedEnd);
  if (scale.invert) {
    domain = {
      start: minValue,
      end: maxValue,
    };
  } else {
    const values = [];
    const scaleDomain = scale.domain();
    for (let i = minValue; i <= maxValue; i += 1) {
      values.push(scaleDomain[i]);
    }
    domain = {
      values,
    };
  }

  return domain;
}

export const DEFAULT_CHART_MARGIN = {
  top: 64,
  right: 64,
  bottom: 64,
  left: 64,
};
export function getSymbol(symbol) {
  switch (symbol) {
    case "circle":
      return (symbol = GlyphCircle);
    case "cross":
      return (symbol = GlyphCross);
    case "diamond":
      return (symbol = GlyphDiamond);
    case "square":
      return (symbol = GlyphSquare);
    case "star":
      return (symbol = GlyphStar);
    case "triangle":
      return (symbol = GlyphTriangle);
    case "wye":
      return (symbol = GlyphWye);
    case "custom":
      return (symbol = CustomGlyph);
    default:
      return (symbol = GlyphCircle);
  }
}
export function getCurve(curve) {
  switch (curve) {
    case "Basis":
      return (curve = curveBasis);
    case "BasisClose":
      return (curve = curveBasisClose);
    case "BasisOpen":
      return (curve = curveBasisOpen);
    case "Step":
      return (curve = curveStep);
    case "StepAfter":
      return (curve = curveStepAfter);
    case "StepBefore":
      return (curve = curveStepBefore);
    case "Bundle":
      return (curve = curveBundle);
    case "Linear":
      return (curve = curveLinear);
    case "LinearClosed":
      return (curve = curveLinearClosed);
    case "MonotoneX":
      return (curve = curveMonotoneX);
    case "MonotoneY":
      return (curve = curveMonotoneY);
    case "Cardinal":
      return (curve = curveCardinal);
    case "CardinalClosed":
      return (curve = curveCardinalClosed);
    case "CardinalOpen":
      return (curve = curveCardinalOpen);
    case "CatmullRom":
      return (curve = curveCatmullRom);
    case "CatmullRomClosed":
      return (curve = curveCatmullRomClosed);
    case "CatmullRomOpen":
      return (curve = curveCatmullRomOpen);
    case "Natural":
      return (curve = curveNatural);
    default:
      return (curve = curveLinear);
  }
}
