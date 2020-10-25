import { AxisScale } from "@visx/axis";
import { ScaleInput } from "@visx/scale";
import { Series, SeriesPoint } from "d3-shape";

export type SeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = {
  /** Required data key for the Series, should be unique across all series. */
  dataKey: string;
  /** Data for the Series. */
  data: Datum[];
  /** Given a Datum, returns the x-scale value. */
  xAccessor: (d: Datum) => ScaleInput<XScale>;
  /** Given a Datum, returns the y-scale value. */
  yAccessor: (d: Datum) => ScaleInput<YScale>;
  /** Given a Datum, returns the elementid value. */
  elAccessor: (d: Datum) => string;
  /** Array of slection ids. */
  currentSelectionIds: Array<number>;
  /** Given a Datum, returns the elementid value. */
  handleClick: (d: Array<number>) => any;
};

/** Bar shape. */
export type Bar = {
  key: string;
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  fill?: string;
};

/** Props for base Bars components */
export type BarsProps<XScale extends AxisScale, YScale extends AxisScale> = {
  bars: Bar[];
  xScale: XScale;
  yScale: YScale;
  horizontal?: boolean;
} & Omit<
  React.SVGProps<SVGRectElement>,
  "x" | "y" | "width" | "height" | "ref"
>;

// BarStack transforms its child series Datum into CombinedData<XScale, YScale>
export type BarStackDatum<
  XScale extends AxisScale,
  YScale extends AxisScale
> = SeriesPoint<CombinedStackData<XScale, YScale>>;

export type BarStackData<
  XScale extends AxisScale,
  YScale extends AxisScale
> = Series<CombinedStackData<XScale, YScale>, string>[];

export type CombinedStackData<
  XScale extends AxisScale,
  YScale extends AxisScale
> = {
  [dataKey: string]: ScaleInput<XScale> | ScaleInput<YScale>;
} & {
  stack: ScaleInput<XScale> | ScaleInput<YScale>;
  positiveSum: number;
  negativeSum: number;
};

/** Glyphs */

export type GlyphsProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = {
  xScale: XScale;
  yScale: YScale;
  horizontal?: boolean;
  glyphs: GlyphProps<Datum>[];
};

export type GlyphProps<Datum extends object> = {
  key: string;
  datum: Datum;
  index: number;
  x: number;
  y: number;
  size: number;
  color: string;
};
