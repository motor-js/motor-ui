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

export default function getSymbol(symbol: unknown): symbol is string {
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
