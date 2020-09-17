import React from "react";
import cx from "classnames";

export default function Bar({ className, innerRef, isSelected, ...restProps }) {
  return (
    <rect ref={innerRef} className={cx("vx-bar", className)} {...restProps} />
  );
}
