/* eslint-disable prefer-template */
import React, { useState, useEffect, useRef } from "react";
import useListObject from "../../hooks/useListObject";
import useOutsideClick from "../../hooks/useOutsideClick";
import { validData } from "../../utils";
import DropdownList from "./DropdownList";
import Spinner from "../Spinner";
import {
  FilterWrapper,
  FilterWrapperNoData,
  FilterTitle,
  FilterTitleDim,
  FilterTitleItems,
  FilterList,
  ChevronUpIcon,
  ChevronDownIcon,
} from "./FilterTheme";

let searchListInputValue = "";

function StyledFilter({
  engine,
  engineError,
  theme,
  dimension,
  label,
  width,
  dropHeight,
  margin,
  size,
  onSelectionChange,
  onSearch,
  single,
  selectionsTitle,
}) {
  // Ref for click outside functionality
  const filterRef = useRef();
  const itemHeight = theme.filter.dropdown.itemHeight[size];
  const [page, setPage] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  // const [sortState, setSortState] = useState(0)
  const [totalStateCounts, setTotalStateCounts] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const viewportHeight = parseInt(dropHeight, 10);

  const qPage = {
    qTop: 0,
    qLeft: 0,
    qWidth: 1,
    qHeight: 10000,
  };

  // retrieve filter data from ListObject
  const {
    qData,
    qLayout,
    select,
    selections,
    searchListObjectFor,
    acceptListObjectSearch,
    beginSelections,
    endSelections,
    changePage,
  } = useListObject({
    qPage,
    engine,
    dimension,
    label,
  });

  useEffect(() => {
    let valid;
    if (qLayout) {
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }
    if (qData && qLayout) {
      const {
        qListObject: {
          qDimensionInfo: { qStateCounts },
        },
      } = qLayout;
      const _totalStateCounts = Object.values(qStateCounts).reduce(
        (a, b) => a + b
      );
      setTotalStateCounts(_totalStateCounts);
    }
  }, [qData, qLayout]);


  useOutsideClick(
    filterRef,
    () => {
      if (listOpen) {
        setListOpen(!listOpen);
        searchListInputValue = "";
        searchListObjectFor("");
        endSelections(true);
        changePage({ qTop: 0 });
        setPage(0);
      }
    },
    []
  );

  const _searchListObjectFor = (event) => {
    searchListInputValue = event.target.value;
    searchListObjectFor(event.target.value);
    onSearch();
  };

  /** clear all of the selections */
  const clear = () => {
    searchListInputValue = "";
    searchListObjectFor("");
  };

  const _acceptListObjectSearch = (event) => {
    if (event.charCode === 13) {
      searchListInputValue = "";
      acceptListObjectSearch();
    }
  };

  const toggleList = () => {
    if (!listOpen) {
      beginSelections();
    } else {
      endSelections(true);
      changePage({ qTop: 0 });
      setPage(0);
    }
    setListOpen(!listOpen);
  };

  const _select = (item) => {
    const { qElemNumber } = item;
    const toggleSelections = !single;
    select([qElemNumber], toggleSelections);
    onSelectionChange();
  };

  const handleSelection = (keys) => {
    select(keys);
    onSelectionChange();
  };

  const _pageCallback = (top, p) => {
    changePage({ qTop: top });
    p === "next" ? setPage(page + 1) : setPage(page - 1);
  };

  return (
    <FilterWrapper
      margin={margin}
      size={size}
      width={width}
      data-testid="filterWrapper"
    >
      {qData && qLayout && isValid ? (
        <div
          ref={filterRef}
          onClick={() => toggleList()}
          style={{ position: "relative" }}
        >
          {selectionsTitle ? (
            <FilterTitle
              selections={selections}
              data-testid="filterTitle"
              open={listOpen}
            >
              {selections && selections.length === 0 && (
                <FilterTitleDim>{`${label}`}</FilterTitleDim>
              )}
              {selections && selections.length === 1 && (
                <FilterTitleItems>
                  {`${label}` + ": " + selections[0][0].qText}
                </FilterTitleItems>
              )}
              {selections && selections.length > 1 && (
                <FilterTitleItems>
                  {`${label}` +
                    ": " +
                    selections.length +
                    " of " +
                    totalStateCounts}
                </FilterTitleItems>
              )}
              {listOpen ? (
                <ChevronUpIcon size={15} />
              ) : (
                <ChevronDownIcon size={15} />
              )}
            </FilterTitle>
          ) : (
            <FilterList
              data-testid="filterTitleNoSel"
              open={listOpen}
              dropHeight={dropHeight}
              width={width}
            >
              {label}
              {listOpen ? (
                <ChevronUpIcon height={15} />
              ) : (
                <ChevronDownIcon height={15} />
              )}
            </FilterList>
          )}
          {listOpen && qData && qLayout && (
            <DropdownList
              qData={qData}
              selectMultipleCallback={_select}
              handleSelCallback={handleSelection}
              viewportHeight={viewportHeight}
              qcy={qLayout ? qLayout.qListObject.qSize.qcy : null}
              qTopCallback={_pageCallback}
              qPage={qPage}
              searchListCallback={_searchListObjectFor}
              searchListInputValue={searchListInputValue}
              acceptListObjectCallback={(e) => _acceptListObjectSearch(e)}
              clearCallback={() => clear()}
              selections={selections}
              itemHeight={itemHeight}
              size={size}
              dropHeight={dropHeight}
              width={width}
              page={page}
            />
          )}
        </div>
      ) : (
        <FilterWrapperNoData margin={margin} size={size} width={width}>
          {dataError || engineError || <Spinner size={30} />}
        </FilterWrapperNoData>
      )}
    </FilterWrapper>
  );
}

export default StyledFilter;
