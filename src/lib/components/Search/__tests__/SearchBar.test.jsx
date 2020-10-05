import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StyledSearch from "../StyledSearch";
import useSearch from "../../../hooks/useSearch";
import SearchTheme from "../SearchTheme";

jest.mock("../../../hooks/useSearch");

describe("SearchBar test", () => {
  useSearch.mockReturnValue({
    searchResults: {
      qSearchGroupArray: [
        {
          qGroupType: "DatasetType",
          qId: 0,
          qItems: [
            {
              qIdentifier: "Dim",
              qItemMatches: [{ qText: "A" }],
              qItemType: "Field",
              qSearchTermsMatched: [0],
              qTotalNumberOfMatches: 1,
            },
          ],
        },
      ],
      qSearchTerms: ["A"],
      qTotalNumberOfGroups: 0,
    },
    select: jest.fn(),
  });

  const { debug, getByTestId } = render(<StyledSearch size="medium" />);
  const search = getByTestId("search-bar");

  it("renders", () => {
    expect(search).toHaveTextContent("");
    fireEvent.change(search, { target: { value: "search" } });
    expect(search.value).toBe("search");
  });

  it("accepts text input, returns suggestions and is selectabe", async () => {
    fireEvent.change(search, { target: { value: "bor" } });
    expect(search.value).toBe("bor");
    const selectable = await getByTestId("value-0");
    fireEvent.click(selectable);
  });
});
