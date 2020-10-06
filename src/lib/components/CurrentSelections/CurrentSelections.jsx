/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from "react";
import PropTypes from "prop-types";
import StyledSelections from "./StyledSelections";
import { EngineContext } from "../../../contexts/EngineProvider";

function CurrentSelections({ ...rest }) {
  const { engine } = useContext(EngineContext)

  return <StyledSelections engine={engine} {...rest} />;
}

// <span style={SelectionsX} onClick={() => toggleList(item.field)}>&nbsp;{<ChevronDown style={IconChevron} height={15}/>}</span>
CurrentSelections.propTypes = {
  /** Size of the selections box */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** Width of the selections box */
  width: PropTypes.string,
  /** Max width of the selections box */
  maxWidth: PropTypes.string,
  /** Set margin */
  margin: PropTypes.string,
  /** Set max height */
  maxHeight: PropTypes.string,
  /** Set min height */
  minHeight: PropTypes.string,
  /** Number of selections the object will
   * display per dimension,
   * before values are grouped */
  selectionsLimit: PropTypes.oneOf([1, 2, 3, 4, 5]),
  /* set overflow properties on the x-axis or y-axis */
  overflow: PropTypes.oneOf(["x-axis", "y-axis"]),
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Name of the parent grid area to place the box */
  gridArea: PropTypes.string,
};

CurrentSelections.defaultProps = {
  size: "medium",
  width: "100%",
  maxWidth: null,
  margin: null,
  maxHeight: "80px",
  minHeight: "80px",
  selectionsLimit: 3,
  overflow: "x-axis",
  flex: null,
  gridArea: null,
};

export default CurrentSelections;
