import {
  arc as d3Arc,
  area as d3Area,
  line as d3Line,
  pie as d3Pie,
  radialLine as d3RadialLine,
  stack as d3Stack,
} from "d3-shape";
import setNumberOrNumberAccessor from "./setNumberOrNumberAccessor";
import stackOrder from "./stackOrder";
import stackOffset from "./stackOffset";

export function arc({
  innerRadius,
  outerRadius,
  cornerRadius,
  startAngle,
  endAngle,
  padAngle,
  padRadius,
}) {
  const path = d3Arc;
  if (innerRadius != null)
    setNumberOrNumberAccessor(path.innerRadius, innerRadius);
  if (outerRadius != null)
    setNumberOrNumberAccessor(path.outerRadius, outerRadius);
  if (cornerRadius != null)
    setNumberOrNumberAccessor(path.cornerRadius, cornerRadius);
  if (startAngle != null)
    setNumberOrNumberAccessor(path.startAngle, startAngle);
  if (endAngle != null) setNumberOrNumberAccessor(path.endAngle, endAngle);
  if (padAngle != null) setNumberOrNumberAccessor(path.padAngle, padAngle);
  if (padRadius != null) setNumberOrNumberAccessor(path.padRadius, padRadius);

  return path;
}

export function area({ x, x0, x1, y, y0, y1, defined, curve }) {
  const path = d3Area();
  if (x) setNumberOrNumberAccessor(path.x, x);
  if (x0) setNumberOrNumberAccessor(path.x0, x0);
  if (x1) setNumberOrNumberAccessor(path.x1, x1);
  if (y) setNumberOrNumberAccessor(path.y, y);
  if (y0) setNumberOrNumberAccessor(path.y0, y0);
  if (y1) setNumberOrNumberAccessor(path.y1, y1);
  if (defined) path.defined(defined);
  if (curve) path.curve(curve);

  return path;
}

export function line({ x, y, defined, curve }) {
  const path = d3Line();
  if (x) setNumberOrNumberAccessor(path.x, x);
  if (y) setNumberOrNumberAccessor(path.y, y);
  if (defined) path.defined(defined);
  if (curve) path.curve(curve);

  return path;
}

export function pie({
  startAngle,
  endAngle,
  padAngle,
  value,
  sort,
  sortValues,
}) {
  const path = d3Pie();

  // ts can't distinguish between these method overloads
  if (sort === null) path.sort(sort);
  else if (sort != null) path.sort(sort);
  if (sortValues === null) path.sortValues(sortValues);
  else if (sortValues != null) path.sortValues(sortValues);

  if (value != null) path.value(value);

  if (padAngle != null) setNumberOrNumberAccessor(path.padAngle, padAngle);
  if (startAngle != null)
    setNumberOrNumberAccessor(path.startAngle, startAngle);
  if (endAngle != null) setNumberOrNumberAccessor(path.endAngle, endAngle);

  return path;
}

export function radialLine({ angle, radius, defined, curve }) {
  const path = d3RadialLine();
  if (angle) setNumberOrNumberAccessor(path.angle, angle);
  if (radius) setNumberOrNumberAccessor(path.radius, radius);
  if (defined) path.defined(defined);
  if (curve) path.curve(curve);

  return path;
}

export function stack({ keys, value, order, offset }) {
  const path = d3Stack();
  if (keys) path.keys(keys);
  if (value) setNumberOrNumberAccessor(path.value, value);
  if (order) path.order(stackOrder(order));
  if (offset) path.offset(stackOffset(offset));

  return path;
}
