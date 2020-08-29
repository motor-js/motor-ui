import React from "react";

/** Example of rendering of a custom legend shape */
export default function CustomLegendShape({ itemIndex, fill, size }) {
  return (
    <div style={{ color: fill, pointerEvents: "none", fontSize: size }}>
      {[...new Array(itemIndex + 1)].map(() => "$")}
    </div>
  );
}
