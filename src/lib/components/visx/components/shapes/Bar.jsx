import React from "react";
import cx from "classnames";

export default function Bar({
  className,
  innerRef,
  noSelections,
  isSelected,
  ...restProps
}) {
  return (
    <rect ref={innerRef} className={cx("visx-bar", className)} {...restProps} />
  );
}