/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import FilterListItem from "./FilterListItem";
import { SelectableGroup, createSelectable } from "../../utils/selectDrag";
import {
  FilterList,
  FilterSearchGroup,
  SearchStyle,
  FilterSearch,
  XStyle,
  NextButton,
  PrevButton,
} from "./FilterTheme";
import Spinner from "../Spinner";

const SelectableFilterList = createSelectable(FilterListItem);

const DropdownList = ({
  qData,
  selectMultipleCallback,
  handleSelCallback,
  viewportHeight,
  qcy,
  qTopCallback,
  qPage,
  searchListCallback,
  searchListInputValue,
  acceptListObjectCallback,
  clearCallback,
  selections,
  itemHeight,
  dropHeight,
  width,
  size,
  page,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  // only load if we are not on the first page
  const [loading, setLoading] = useState(false);
  const node = useRef();
  const rowHeight = itemHeight;

  const pageHeight = qPage.qHeight;
  const NoOfPages = Math.ceil(qcy / qPage.qHeight);
  const ItemsLeft = qcy - qPage.qHeight * page;
  const itemsOnPage = page === NoOfPages ? qcy / page : qPage.qHeight;
  const offset = 0;
  const innerHeight = Math.min(ItemsLeft, pageHeight) * rowHeight + offset;

  useEffect(() => {
    // logic to remove bug, where scrolling back from a page causes data to
    // initially be populated with zero rows. this is a workaround...
    // If we page backwards, loading is set to TRUE, this is resolved to false after a timeout
    if (!loading) return;
    // set loading to false after 0.5 secs so full previous data can render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // reset timer
    return () => clearTimeout(timer);
  }, [qData]);

  const nextPage = () => {
    const top = qPage.qHeight * page + qPage.qHeight;
    qTopCallback(top, "next");
    node.current.scrollTop = 0;
  };

  const prevPage = (e) => {
    setLoading(true);
    e.preventDefault();
    const top = qPage.qHeight * page - qPage.qHeight;
    qTopCallback(top, "prev");
    node.current.scrollTop = 0;
  };

  const handle = (keys) => handleSelCallback(keys);

  const handleSearchListObject = (e) => searchListCallback(e);

  const clear = () => clearCallback();

  const startIndex = Math.max(0, Math.floor((scrollTop - 40) / rowHeight));

  const endIndex = Math.min(
    pageHeight - 1,
    ItemsLeft - 1,
    Math.floor((scrollTop + viewportHeight) / rowHeight)
  );

  const getItems = () => {
    const data = [];
    if (qData) {
      for (let i = startIndex; i <= endIndex; i++) {
        data.push(
          <SelectableFilterList
            data={qData.qMatrix[i]}
            rowHeight={rowHeight}
            key={qData.qMatrix[i][0].qElemNumber}
            selections={selections}
            selectMultipleCallback={selectMultipleCallback}
            selectableKey={qData.qMatrix[i][0].qElemNumber}
            i={i}
            size={size}
            itemHeight={itemHeight}
          />
        );
      }

      return data;
    }
  };

  const handleScroll = (e) => setScrollTop(e.currentTarget.scrollTop);

  const prevButton = () => {
    if (page !== 0) {
      return (
        <PrevButton
          itemsOnPage={itemsOnPage}
          rowHeight={rowHeight}
          onClick={prevPage}
        >
          Previous Page
        </PrevButton>
      );
    }

    return (
      // hide button workaround
      <PrevButton
        style={{ position: "absolute", zIndex: "-1000", border: "0px" }}
      />
    );
  };

  const nextButton = () => {
    if (NoOfPages !== page + 1) {
      return (
        <NextButton
          itemsOnPage={itemsOnPage}
          rowHeight={rowHeight}
          onClick={nextPage}
        >
          Next Page
        </NextButton>
      );
    }

    return (
      // hide button workaround
      <NextButton style={{ zIndex: "-1000", border: "0px" }} />
    );
  };

  return (
    <FilterList
      dropHeight={dropHeight}
      width={width}
      ref={node}
      data-testid="dropdown"
      onScroll={handleScroll}
      selections={selections}
      onClick={(e) => e.stopPropagation()}
    >
      {page === 0 && (
        <FilterSearchGroup>
          <SearchStyle size={15} />
          <FilterSearch
            aria-label="search"
            data-testid="dd-search"
            placeholder="Search"
            type="text"
            size={size}
            onChange={handleSearchListObject}
            value={searchListInputValue}
            onKeyPress={(e) => acceptListObjectCallback(e)}
          />
          {searchListInputValue === "" ? (
            ""
          ) : (
            <XStyle onClick={clear} size={15} />
          )}
        </FilterSearchGroup>
      )}
      {prevButton()}
      {!loading ? (
        <SelectableGroup
          onSelection={handle}
          style={{
            position: "relative",
            height: `${innerHeight}px`,
          }}
        >
          {getItems()}
          {searchListInputValue === "" && nextButton()}
          <div
            className="ScrollPlaceholder"
            style={{
              position: "absolute",
              top: `${innerHeight}px`,
              height: "1px",
              width: "1px",
            }}
          />
        </SelectableGroup>
      ) : (
        <Spinner />
      )}
    </FilterList>
  );
};

DropdownList.propTypes = {
  /* Data for the dropdown list */
  qData: PropTypes.object.isRequired,
  /* Callback to handle multiple selections */
  selectMultipleCallback: PropTypes.func.isRequired,
  /* Callback to handle selections */
  handleSelCallback: PropTypes.func.isRequired,
  /* Height of the dropdown */
  viewportHeight: PropTypes.number.isRequired,
  /* Total number of items in the dropdown list */
  qcy: PropTypes.number.isRequired,
  /* Callback for handling the search box on change results  */
  searchListCallback: PropTypes.func.isRequired,
  /* Callback to capture value of search input  */
  searchListInputValue: PropTypes.string.isRequired,
  /* Callback to return inut into search field  */
  acceptListObjectCallback: PropTypes.func.isRequired,
  /* Callback for on click of X icon (used to clear search results)  */
  clearCallback: PropTypes.func.isRequired,
  /* Callback for selected items  */
  selections: PropTypes.array,
  /* Height of each item row  */
  itemHeight: PropTypes.number.isRequired,
};

DropdownList.defaultProps = {
  selections: [],
};

export default DropdownList;
