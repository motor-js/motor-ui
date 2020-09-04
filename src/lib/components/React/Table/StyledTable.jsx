import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import useHyperCube from "../../../hooks/useHyperCube";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Button from "../Button";
import SelectionModal from "../SelectionModal";
import useOutsideClick from "../../../hooks/useOutsideClick";
import exportData from "../../../utils/exportData";
import { validData } from "../../../utils";
import Spinner from "../Spinner";
import {
  TableWrapper,
  TableWrapperNoData,
  TableNoDataContent,
  TableOutline,
  DropMenu,
} from "./TableTheme";
import {
  StepBackward,
  Backward,
  StepForward,
  Forward,
} from "@styled-icons/fa-solid";

const StyledTable = ({
  engine,
  engineError,
  theme,
  config,
  columns,
  columnOrder,
  calcCondition,
  columnSortOrder,
  grandTotalsFlag,
  margin,
  height,
  wrapperWidth,
  tableWidth,
  size,
  pageHeight,
  tableLayout,
  headerAlignment,
  headerBackgroundColor,
  headerFontColor,
  interactiveSort,
  grid,
  bandedRows,
  highlightOnSelection,
  allowSelections,
  gridArea,
  backgroundColor,
  bodyAlignment,
  border,
  borderRadius,
}) => {
  // Component state
  const [loading, setLoading] = useState(true);
  const [isSelectionVisible, setSelectionVisible] = useState(false);
  const [selectionsActive, setSelectionsActive] = useState(false);
  const [mergedCols, setMergedCols] = useState(null);
  const [objId, setObjId] = useState(null);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [pendingSel, setPendingSel] = useState([]);
  const [selCol, setCol] = useState();

  const tableRef = useRef();
  const wrapperRef = useRef();

  const gridPxl = grid ? "1px" : "0px";

  // destructure cols
  const { dimensions, measures } = columns[0];
 // console.log(dimensions, measures)
  // calculate the number of columns for HyperCube size
  let numberOfColumns;
  if (dimensions && measures) {
    numberOfColumns = dimensions.length + measures.length;
  } else if (dimensions && !measures) {
    numberOfColumns = dimensions.length;
  } else if (!dimensions && measures) {
    numberOfColumns = measures.length;
  } else {
    numberOfColumns = 0;
  }

  // Set qPage for initial hypercube size
  const qPage = {
    qTop: 0,
    qLeft: 0,
    qWidth: Math.min(numberOfColumns, 20),
    qHeight: pageHeight,
  };

  // concat dims and measures and add ID needed for column ordering
  let colsTmp;
  if (measures === undefined) {
    colsTmp = dimensions;
  } else if (measures === undefined) {
    colsTmp = measures;
  } else {
    colsTmp = dimensions.concat(measures);
  }

  const cols = colsTmp.map((n, i) => {
    n.id = i;

    return n;
  });

  const {
    qLayout,
    qData,
    endSelections,
    beginSelections,
    changePage,
    selections,
    select,
    applyPatches,
  } = useHyperCube({
    engine,
    cols,
    qColumnOrder: columnOrder,
    qCalcCondition: calcCondition,
    qPage,
    qInterColumnSortOrder: columnSortOrder,
    // qSupressMissing: true,
    // qSuppressZero: true,
  });

  useEffect(() => {
    let valid;
    if (qLayout) {
      setObjId(qLayout.qInfo.qId);
      setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }
  }, [qLayout, qData]);

  // page size
  const [pageSize, setPageSize] = useState(qPage.qHeight);

  // page
  const [page, _setPage] = useState(0);
  const setPage = useCallback(
    (_page) => {
      setLoading(true);
      _setPage(_page);
      changePage({ qTop: _page * pageSize });
    },
    [changePage, pageSize]
  );
  window.setPage = setPage;

  // pages
  const [pages, _setPages] = useState(0);
  const setPages = useCallback(
    (_pages) => {
      if (page >= _pages) {
        setPage(0);
      }
      _setPages(_pages);
    },
    [page, setPage]
  );

  useEffect(() => {
    if (!qLayout) return;
    setPages(Math.ceil(qLayout.qHyperCube.qSize.qcy / pageSize));
  }, [qLayout, pageSize, setPage, setPages]);

  const handlePageChange = useCallback(
    (pageIndex) => {
      setPage(pageIndex);
    },
    [setPage]
  );

  const handleSortedChange = useCallback(
    async (column) => {
      setLoading(true);
      // If no sort is set, we need to set a default sort order
      if (column.qSortIndicator === "N") {
        if (column.qPath.includes("qDimensions")) {
          await applyPatches([
            {
              qOp: "add",
              qPath: `${column.qPath}/qDef/qSortCriterias`,
              qValue: JSON.stringify([{ qSortByLoadOrder: 1 }]),
            },
          ]);
        }
        if (column.qPath.includes("qMeasures")) {
          await applyPatches([
            {
              qOp: "add",
              qPath: `${column.qPath}/qSortBy`,
              qValue: JSON.stringify({ qSortByLoadOrder: 1 }),
            },
          ]);
        }
      }
      await applyPatches([
        {
          qOp: "replace",
          qPath: `${column.qPath}/qDef/qReverseSort`,
          qValue: JSON.stringify(
            !column.qReverseSort
          ) /* JSON.stringify((newSorted[0].desc !== column.defaultSortDesc) !== !!column.qReverseSort) */,
        },
        {
          qOp: "replace",
          qPath: "/qHyperCubeDef/qInterColumnSortOrder",
          qValue: JSON.stringify(
            [
              ...qLayout.qHyperCube.qEffectiveInterColumnSortOrder,
            ].sort((a, b) =>
              a === column.qInterColumnIndex
                ? -1
                : b === column.qInterColumnIndex
                ? 1
                : 0
            )
          ),
        },
      ]);
      setPage(0);
    },
    [applyPatches, qLayout]
  );

  const columnData = useMemo(
    () =>
      qLayout
        ? [
            ...qLayout.qHyperCube.qDimensionInfo.map((col, index) => ({
              Header: col.qFallbackTitle,
              accessor: (d) => d[index].qText,
              defaultSortDesc: col.qSortIndicator === "D",
              qInterColumnIndex: index,
              qPath: `/qHyperCubeDef/qDimensions/${index}`,
              qSortIndicator: col.qSortIndicator,
              qReverseSort: col.qReverseSort,
              qGrandTotals: { qText: null, qNum: null },
              qColumnType: "dim",
            })),
            ...qLayout.qHyperCube.qMeasureInfo.map((col, index) => ({
              Header: col.qFallbackTitle,
              accessor: (d) =>
                d[index + qLayout.qHyperCube.qDimensionInfo.length].qText,
              defaultSortDesc: col.qSortIndicator === "D",
              qInterColumnIndex:
                index + qLayout.qHyperCube.qDimensionInfo.length,
              qPath: `/qHyperCubeDef/qMeasures/${index}`,
              qSortIndicator: col.qSortIndicator,
              qReverseSort: col.qReverseSort,
              qGrandTotals: qLayout.qHyperCube.qGrandTotalRow[index],
              qColumnType: "meas",
            })),
          ]
        : [],
    [qLayout]
  );

  // merge cols object & sort
  useEffect(() => {
    const merged = [];
    if (columnData.length > 0) {
      for (let i = 0; i < cols.length; i++) {
        merged.push({
          ...cols[i],
          ...columnData.find(
            (itmInner) => itmInner.Header === (cols[i].qLabel || cols[i].qField)
          ),
        });
      }
      merged.sort(
        (a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)
      );
      setMergedCols(merged);
    }
  }, [columnData]);

  const handleSelect = (s, c) => {
    if (!allowSelections) return;

    if (c.qColumnType !== "meas") {
      let updateList = [];
      if (pendingSel.includes(s)) {
        updateList = pendingSel.filter((item) => item != s);
        setPendingSel(updateList);
      } else {
        setPendingSel([...pendingSel, s]);
      }
      beginSelections();
      setSelectionsActive(true);
      setSelectionVisible(true);
      setCol(c.id);

      // console.log(c.id, s, selCol);
      // if (selCol === undefined || c.id === selCol) {
      //   select(c.id, [...pendingSel, s]);
      // } else {
      //   select(c.id, [s]);
      // }
      select(c.id, [...pendingSel, s]);
    }
  };

  const confirmSelections = async () => {
    // pendingSel === [] ? "" : await select(selCol, pendingSel);
    await endSelections(true);
    setSelectionsActive(false);
    setSelectionVisible(false);
    setPage(0);
    tableRef.current.scrollTop = 0;
    setPendingSel([]);
  };

  const cancelSelections = () => {
    endSelections(false);
    setSelectionsActive(false);
    setSelectionVisible(false);
    setPendingSel([]);
  };

  useOutsideClick(
    wrapperRef,
    () => {
      if (
        event.target.classList.contains("cancelSelections") ||
        event.target.parentNode.classList.contains("cancelSelections")
      )
        return;
      if (isSelectionVisible && selections) confirmSelections();
    },
    []
  );

  const dataExport = () => {
    exportData(engine, config, objId, "table");
  };

  const incrementPage = () => {
    const nextPage = page + 1;
    handlePageChange(nextPage);
    handleScrollCallback();
  };

  const decrementPage = () => {
    let prevPage;
    if (page === 0) {
      prevPage = page;
    } else {
      prevPage = page - 1;
      handlePageChange(prevPage);
      handleScrollCallback();
    }
  };

  const firstPage = () => {
    handlePageChange(0);
    handleScrollCallback();
  };

  const lastPage = () => {
    const lastPage = pages - 1;
    handlePageChange(lastPage);
    handleScrollCallback();
  };

  const handleScrollCallback = () => {
    tableRef.current.scrollTop = 0;
  };

  const divStyle = {
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px 12px",
    border: "1px solid grey",
    backgroundColor: "white",
    borderRadius: "2px",
    zIndex: "500",

    "&:hover": {
      backgroundColor: "grey",
    },
  };

  return (
    <div
      ref={wrapperRef}
      data-testid="wrap"
      style={{
        position: "relative",
        margin,
      }}
    >
      <SelectionModal
        width={wrapperWidth}
        isOpen={isSelectionVisible}
        confirmCallback={confirmSelections}
        cancelCallback={cancelSelections}
      />
      {qData && qLayout && mergedCols && isValid ? (
        <div>
          <ContextMenuTrigger id="context-menu" hideOnLeave>
            <ContextMenu id="context-menu" style={divStyle}>
              <MenuItem onClick={dataExport}>Export Data</MenuItem>
            </ContextMenu>
            <TableWrapper
              ref={tableRef}
              data-testid="tableRef"
              wrapperWidth={wrapperWidth}
              height={height}
              size={size}
              onClick={(e) => e.stopPropagation()}
              gridArea={gridArea}
              border={border}
              backgroundColor={backgroundColor}
              borderRadius={borderRadius}
            >
              <TableOutline tableLayout={tableLayout} tableWidth={tableWidth}>
                <TableHeader
                  columns={mergedCols}
                  sortChangeCallback={handleSortedChange}
                  grandTotalsFlag={grandTotalsFlag}
                  interactiveSort={interactiveSort}
                  headerAlignment={headerAlignment}
                  headerBackgroundColor={headerBackgroundColor}
                  headerFontColor={headerFontColor}
                  gridPxl={gridPxl}
                />
                <TableBody
                  columns={mergedCols}
                  qData={qData || null}
                  qcy={qLayout ? qLayout.qHyperCube.qSize.qcy : null}
                  handleSelCallback={handleSelect}
                  page={page}
                  pageHeight={pageHeight}
                  handlePagingCallback={handlePageChange}
                  handleScrollCallback={handleScrollCallback}
                  selectionsActive={selectionsActive}
                  bodyAlignment={bodyAlignment}
                  gridPxl={gridPxl}
                  bandedRows={bandedRows}
                  highlightOnSelection={highlightOnSelection}
                  pendingSel={pendingSel}
                  selCol={selCol}
                />
              </TableOutline>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${pages > 1 ? "30% auto 30%" : "100%"}`,
                  gridGap: "10px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {pages > 1 && (
                  <div style={{ textAlign: "left" }}>
                    <Button
                      disabled={page > 0 ? false : true}
                      size="small"
                      type="default"
                      onClick={firstPage}
                    >
                      <Backward size={16} />
                    </Button>
                    <Button
                      disabled={page > 0 ? false : true}
                      size="small"
                      type="default"
                      onClick={decrementPage}
                    >
                      <StepBackward size={16} />
                    </Button>
                  </div>
                )}
                <div style={{ margin: "auto" }}>
                  Page {page + 1} of {pages}
                </div>
                {pages > 1 && (
                  <div style={{ textAlign: "right" }}>
                    <Button
                      disabled={page + 1 < pages ? false : true}
                      size="small"
                      type="default"
                      onClick={incrementPage}
                    >
                      <StepForward size={16} />
                    </Button>
                    <Button
                      disabled={page + 1 < pages ? false : true}
                      size="small"
                      type="default"
                      onClick={lastPage}
                    >
                      <Forward size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </TableWrapper>
          </ContextMenuTrigger>
        </div>
      ) : (
        <div>
          <TableWrapperNoData
            wrapperWidth={wrapperWidth}
            height={height}
            size={size}
            gridArea={gridArea}
            border={border}
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
          >
            <TableNoDataContent height={height}>
              {calcCond || dataError || engineError || <Spinner />}
            </TableNoDataContent>
          </TableWrapperNoData>
        </div>
      )}
    </div>
  );
};

export default StyledTable;
