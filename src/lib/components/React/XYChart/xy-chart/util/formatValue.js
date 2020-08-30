import { roundNumber } from "./roundNumber";

export function formatValue(roundNum, val, precision) {
  let formattedValue = roundNum
    ? roundNumber(Math.abs(val), precision)
    : Math.abs(val);

  return val < 0 ? `-${formattedValue}` : formattedValue;
}
