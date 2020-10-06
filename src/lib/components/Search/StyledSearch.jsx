import React, { useState, useEffect, useRef } from "react";
import useSearch from "../../hooks/useSearch";
import Suggestions from "./Suggestions";
import useOutsideClick from "../../hooks/useOutsideClick";
import {
  SearchWrapper,
  SearchBar,
  SearchInput,
  SearchIcon,
  XIcon,
} from "./SearchTheme";

const StyledSearch = ({
  engine,
  engineError,
  dimensions,
  size,
  width,
  margin,
  dropHeight,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [qCount, setQCount] = useState(10);
  const [qGroupItemCount, setQGroupOptions] = useState(10);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef();

  const {
    searchResults,
    select,
    //  beginSelections,
    //  endSelections,
  } = useSearch({
    engine,
    searchValue,
    dimensions,
    qCount,
    qGroupItemCount,
  });

  // handle search test change
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // handle opening of suggestions & loading indicator
  useEffect(() => {
    if (searchValue === "") {
      setListOpen(false);
      setLoading(true);
    } else {
      setListOpen(true);
    }
  }, [searchValue]);

  // number of search suggestions returned
  const loadSearchTerms = () => {
    setQCount(qCount + 5);
  };

  // number of items returns within a dimension
  const loadSearchItems = () => setQGroupOptions(qGroupItemCount * 2);

  // clear search icon
  const clearSearch = () => {
    setSearchValue("");
    setListOpen(false);
    setLoading(true);
  };

  // handle select, close suggestions and clear search terms
  const handleSelect = (id) => {
    //  beginSelections();
    select(id);
    //   endSelections(true);
    setListOpen(false);
    setSearchValue("");
  };

  // outside click functionality
  useOutsideClick(
    searchRef,
    () => {
      const outsideClick = !searchRef.current.contains(event.target);
      outsideClick &&
        setSearchValue("") &&
        setListOpen(false) &&
        setLoading(true);
    },
    []
  );

  // handle loading indicator
  useEffect(() => {
    searchResults &&
      searchResults.qSearchGroupArray.length > 0 &&
      setLoading(false);
  }, [searchResults]);

  return (
    <SearchWrapper width={width} margin={margin} ref={searchRef}>
      <SearchBar>
        <SearchIcon size={15} />
        <SearchInput
          size={size}
          data-testid="search-bar"
          type="text"
          placeholder="Search application..."
          value={searchValue}
          onChange={(e) => handleInputChange(e)}
        />
        {searchValue !== "" && <XIcon onClick={clearSearch} size={15} />}
      </SearchBar>
      {listOpen && engine && (
        <Suggestions
          searchResults={searchResults}
          dimensions={dimensions}
          qCount={qCount}
          qGroupItemCount={qGroupItemCount}
          loadSearchTermsCallback={loadSearchTerms}
          loadSearchItemsCallback={loadSearchItems}
          selectCallback={handleSelect}
          loading={loading}
          width={width}
          dropHeight={dropHeight}
          size={size}
        />
      )}
    </SearchWrapper>
  );
};

export default StyledSearch;
