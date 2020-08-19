import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledTable from "./StyledTable";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

const Table = ({ config, ...rest }) => {
  const myConfig = config || useContext(ConfigContext);
  const myTheme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledTable
      engine={engine}
      config={myConfig}
      theme={myTheme}
      engineError={engineError}
      {...rest}
    />
  );
};

Table.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /* An array of objects to define the data to be used in the component.
  The columns need a dimension and / or measure object. See "Column Definition" below for the detailed object properties */
  columns: PropTypes.array.isRequired,
  /* An array of integers (starting from 0), set the order of your table columns.
  Default order is as defined in the columns prop, with dimensions listed first and then measures.
  */
  columnOrder: PropTypes.array,
  /* Add a calculation condition that needs to be met in order for the table to render.
  Accepts an object taking a qCond (Condition for calculatng a hypercube, dim or measure)
  and qMsg (Displayed if qCond is not fulfilled)
  */
  calcCondition: PropTypes.shape({
    qCond: PropTypes.string,
    qMsg: PropTypes.string,
  }),
  /* Column sort order. Your columns by default will be sorted from top to bottom in your columns object definition.
  You can use this to override that default, with the first dimension given a sort positon of 0. Mainly used if you need
  to mix the ordering of dimensions and measures.
  qCond: {}, qMsg: {}
  */
  columnSortOrder: PropTypes.array,
  /* Set to true to show a grand totals row at the top of the table object */
  grandTotalsFlag: PropTypes.bool,
  /* table margin */
  margin: PropTypes.string,
  /* table height */
  height: PropTypes.string,
  /* Width of the outer wrapper around the table object.
  If this is smaller than the table width, a horizontal scrollbar will enable you
  to view all columns
  */
  wrapperWidth: PropTypes.string,
  /* table width
   */
  tableWidth: PropTypes.string,
  /* table size */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /* Number of records to be returned per page of the table.
  Note that increasing this will have a performance impact */
  pageHeight: PropTypes.number,
  /* Defines the algorithm used to lay out table cells, rows and columns.
  For more information regarding the impact, please see https://www.w3schools.com/cssref/pr_tab_table-layout.asp */
  tableLayout: PropTypes.oneOf(["fixed", "auto"]),
  /* Alignment of header row */
  headerAlignment: PropTypes.oneOf(["left", "center", "right", "leftRight"]),
  /* header background color */
  headerBackgroundColor: PropTypes.string,
  /* header font color */
  headerFontColor: PropTypes.string,
  /* Toggle interactive sorting icon in table header */
  interactiveSort: PropTypes.bool,
  /* Add or remove the table grid */
  grid: PropTypes.bool,
  /* Add or remove banded rows */
  bandedRows: PropTypes.bool,
  /* Highlight cells on selection */
  highlightOnSelection: PropTypes.bool,
  /* To allow or disable selections */
  allowSelections: PropTypes.bool,
  /* Text aligmentment */
  bodyAlignment: PropTypes.oneOf(["left", "center", "right", "leftRight"]),
};

Table.defaultProps = {
  config: null,
  columnOrder: [],
  calcCondition: undefined,
  columnSortOrder: [],
  grandTotalsFlag: false,
  margin: "0px",
  height: "400px",
  wrapperWidth: "100%",
  tableWidth: "100%",
  size: "medium",
  pageHeight: 30,
  tableLayout: "auto",
  headerAlignment: "left",
  headerBackgroundColor: null,
  headerFontColor: null,
  interactiveSort: false,
  grid: false,
  bandedRows: false,
  highlightOnSelection: false,
  allowSelections: true,
  bodyAlignment: "left",
};

export default Table;
