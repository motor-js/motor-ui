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
      break;
    case "cross":
      return (symbol = GlyphCross);
      break;
    case "diamond":
      return (symbol = GlyphDiamond);
      break;
    case "square":
      return (symbol = GlyphSquare);
      break;
    case "star":
      return (symbol = GlyphStar);
      break;
    case "triangle":
      return (symbol = GlyphTriangle);
      break;
    case "wye":
      return (symbol = GlyphWye);
      break;
    case "custom":
      return (symbol = CustomGlyph);
      break;
    default:
      return (symbol = GlyphCircle);
      break;
  }
}
