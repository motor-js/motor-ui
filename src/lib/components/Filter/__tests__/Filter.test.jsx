import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filter from "../Filter";
import useListObject from "../../../hooks/useListObject";

jest.mock("../../../hooks/useListObject");
const { listobject } = require("qix-faker");

afterEach(cleanup);

const lo = listobject({
  numRows: 10,
  dimension: (d) => d.name.firstName(),
});

// console.log(lo.qDataPages[0].qMatrix)
describe("Filter test", () => {
  useListObject.mockReturnValue({
    qLayout: { qListObject: lo },
    qData: lo.qDataPages[0],
    selections: [],
    beginSelections: jest.fn(),
  });

  const label = "Province";
  const dimension = "province";

  it("renders with a label", () => {
    const { getByTestId } = render(
      <Filter label={label} dimension={dimension} />
    );
    expect(getByTestId("filterTitle")).toHaveTextContent("Province");
  });

  it("renders with a label when selectionsTitle={false}", () => {
    const { getByTestId } = render(
      <Filter label={label} dimension={dimension} selectionsTitle={false} />
    );
    expect(getByTestId("filterTitleNoSel")).toHaveTextContent("Province");
  });
});

/*
  it('debug',() => {
    const { debug } = render(
      <Filter
        label={label}
        dimension={dimension}
        selectionsTitle={true}
      />
      )

      debug()
  })
*/
