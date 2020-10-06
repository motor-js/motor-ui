import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  StyledSidebarLegacy,
  SidebarLegacyOverlay,
} from "./StyledSidebarLegacy";
import useOutsideClick from "../../hooks/useOutsideClick";

const SidebarLegacy = ({
  children,
  isOpen,
  showOverlay,
  collapsable,
  width,
  onOutsideClick,
  ...rest
}) => {
  const ref = useRef();

  useOutsideClick(ref, () => {
    if (isOpen) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick) onOutsideClick();
    }
  });

  return (
    <>
      <SidebarLegacyOverlay open={isOpen} overlay={showOverlay} />
      <div ref={ref}>
        <StyledSidebarLegacy
          collapsable={collapsable}
          height={{ min: "100%" }}
          open={isOpen}
          width={width}
          {...rest}
        >
          {children}
        </StyledSidebarLegacy>
      </div>
    </>
  );
};

export default SidebarLegacy;

SidebarLegacy.propTypes = {
  /** contents of the SidebarLegacy */
  children: PropTypes.node,
  /** whether the SidebarLegacy is collapsable */
  collapsable: PropTypes.bool,
  pullRight: PropTypes.bool,
  showOverlay: PropTypes.bool,
  width: PropTypes.string,
};

SidebarLegacy.defaultProps = {
  children: undefined,
  collapsable: false,
  pullRight: false,
  showOverlay: true,
  width: "100%",
};
