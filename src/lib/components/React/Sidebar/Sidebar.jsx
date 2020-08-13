import React, { useRef } from "react";
import PropTypes from "prop-types";
import { StyledSidebar, SideBarOverlay } from "./StyledSidebar";
import useOutsideClick from "../../../hooks/useOutsideClick";

const Sidebar = ({
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
      <SideBarOverlay open={isOpen} overlay={showOverlay} />
      <div ref={ref}>
        <StyledSidebar
          collapsable={collapsable}
          height={{ min: "100%" }}
          open={isOpen}
          width={width}
          {...rest}
        >
          {children}
        </StyledSidebar>
      </div>
    </>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  /** contents of the sidebar */
  children: PropTypes.node,
  /** whether the sidebar is collapsable */
  collapsable: PropTypes.bool,
  pullRight: PropTypes.bool,
  showOverlay: PropTypes.bool,
  width: PropTypes.string,
};

Sidebar.defaultProps = {
  children: undefined,
  collapsable: false,
  pullRight: false,
  showOverlay: true,
  width: "100%",
};
