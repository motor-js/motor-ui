import React from "react";
import PropTypes from "prop-types";
import StyledSidebar from "./StyledSidebar";

const Sidebar = ({ children, isOpen, collapsable, width, ...rest }) => {
  return (
    <StyledSidebar
      collapsable={collapsable}
      height={{ min: "100%" }}
      open={isOpen}
      width={width}
      {...rest}
    >
      {children}
    </StyledSidebar>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  /** contents of the sidebar */
  children: PropTypes.node,
  /** whether the sidebar is collapsable */
  collapsable: PropTypes.bool,
  pullRight: PropTypes.bool,
  width: PropTypes.string,
};

Sidebar.defaultProps = {
  children: undefined,
  collapsable: false,
  pullRight: false,
  width: "100%",
};
