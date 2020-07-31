import React from "react";
import PropTypes from "prop-types";
import { StyledSidebar, SideBarOverlay } from "./StyledSidebar";

const Sidebar = ({
  children,
  isOpen,
  showOverlay,
  collapsable,
  width,
  ...rest
}) => {
  return (
    <SideBarOverlay open={isOpen} overlay={showOverlay}>
      <StyledSidebar
        collapsable={collapsable}
        height={{ min: "100%" }}
        open={isOpen}
        width={width}
        {...rest}
      >
        {children}
      </StyledSidebar>
    </SideBarOverlay>
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
  showOverlay: false,
  width: "100%",
};
