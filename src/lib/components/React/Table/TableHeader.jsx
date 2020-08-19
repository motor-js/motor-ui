import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "react-feather";
import {
  HeaderRow,
  HeaderCell,
  GrandTotalsCell,
  GrandTotalsRow,
} from "./TableTheme";

const TableHeader = ({
  columns,
  sortChangeCallback,
  grandTotalsFlag,
  interactiveSort,
  headerAlignment,
  headerBackgroundColor,
  headerFontColor,
  gridPxl,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef();

  const sortChange = (col) => {
    sortChangeCallback(col);
  };

  useEffect(() => {
    setHeaderHeight(headerRef.current.clientHeight);
  }, []);

  const renderTableHeader = () =>
    columns.map((data, i) => (
      <HeaderCell
        headerBackgroundColor={headerBackgroundColor}
        headerAlignment={headerAlignment}
        headerFontColor={headerFontColor}
        key={i}
        type={data.qColumnType}
        onClick={() => (interactiveSort ? sortChange(data) : null)}
      >
        {data.Header}
        {interactiveSort && (
          <span>
            {data.qReverseSort ? (
              <ChevronUp
                height={12}
                strokeWidth={3}
                // onClick={() => sortChange(data)}
              />
            ) : (
              <ChevronDown
                height={12}
                strokeWidth={3}
                // onClick={() => sortChange(data)}
              />
            )}
          </span>
        )}
      </HeaderCell>
    ));

  const renderGrandTotals = () =>
    columns.map((data, i) => (
      <GrandTotalsCell offsetTop={headerHeight} key={i}>
        {i === 0 && data.qColumnType === "dim"
          ? "Totals"
          : data.qGrandTotals.qText}
      </GrandTotalsCell>
    ));

  return (
    <thead>
      <HeaderRow ref={headerRef} gridPxl={gridPxl}>
        {renderTableHeader()}
      </HeaderRow>
      {grandTotalsFlag && (
        <GrandTotalsRow gridPxl={gridPxl}>{renderGrandTotals()}</GrandTotalsRow>
      )}
    </thead>
  );
};

export default TableHeader;
