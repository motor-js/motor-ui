import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrentSelections from "../CurrentSelections";
import SelectionObject from "../../../hooks/useSelectionObject";

jest.mock("../../../hooks/useSelectionObject");

afterEach(cleanup);

describe("Multiple Selections", () => {
  it("renders multiple selections", () => {
    SelectionObject.mockReturnValue({
      qLayout: {
        qSelectionInfo: {},
        qSelectionObject: {
          qBackCount: 0,
          qForwardCount: 0,
          qSelections: [
            {
              qField: "Dim",
              qSelected: "Value1, Value2, Value3",
              qSelectedFieldSelectionInfo: [
                {
                  qName: "Value1",
                },
                {
                  qName: "Value2",
                },
                {
                  qName: "Value3",
                },
              ],
              qSelectedCount: 3,
              qTotal: 457,
            },
          ],
        },
      },
    });

    const { getByTestId } = render(<CurrentSelections selectionsLimit={2} />);
    expect(getByTestId("selectValue")).toHaveTextContent("3 of 457");
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
