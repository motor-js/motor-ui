import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import matchMediaMock from "../../../../../../config/matchMediaMock";
import KPI from "../KPI";
import useHyperCube from "../../../hooks/useHyperCube";

jest.mock("../../../hooks/useHyperCube");
const { hypercube } = require("qix-faker");

afterEach(cleanup);

const hc = hypercube({
  measures: [(f) => f.commerce.price(100, 100, 0)],
  numRows: 1,
});

describe("KPI test", () => {
  useHyperCube.mockReturnValue({
    qData: hc.qDataPages[0],
  });

  it("renders with a label", () => {
    const { getByTestId } = render(<KPI label="Test Label" />);
    expect(getByTestId("kpiLabel")).toHaveTextContent("Test Label");
  });

  it("renders a value", () => {
    const { getByTestId } = render(<KPI label="Test Label" />);
    expect(getByTestId("kpiValue")).toHaveTextContent("100");
  });

  it("return onClick function", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <KPI label="Test Label" onClick={onClick} />
    );
    const kpi = getByTestId("kpiLabel");
    fireEvent.click(kpi);
    expect(onClick).toHaveBeenCalled();
  });

  // KPI theme tests

  it("is receiving left alignment", () => {
    const { getByTestId } = render(
      <KPI responsive={false} size="small" justifyContent="flex-start" />
    );
    const kpi = getByTestId("kpiWrapper");
    expect(kpi).toHaveStyle("justify-content: flex-start");
  });

  it("is receiving right alignment", () => {
    const { getByTestId } = render(
      <KPI responsive={false} size="small" justifyContent="flex-end" />
    );
    const kpi = getByTestId("kpiWrapper");
    expect(kpi).toHaveStyle("justify-content: flex-end");
  });

  it("is receiving center alignment", () => {
    const { getByTestId } = render(
      <KPI responsive={false} size="small" justifyContent="center" />
    );
    const kpi = getByTestId("kpiWrapper");
    expect(kpi).toHaveStyle("justify-content: center");
  });

  it("is receiving center alignment with default props", () => {
    const { getByTestId } = render(<KPI responsive={false} size="small" />);
    const kpi = getByTestId("kpiWrapper");
    expect(kpi).toHaveStyle("justify-content: center");
  });
});
