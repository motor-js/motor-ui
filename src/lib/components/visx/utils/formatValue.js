import roundNumber from "./roundNumber";

export function formatValue(val, roundNum, precision) {
  let formattedValue = roundNum
    ? roundNumber(Math.abs(val), precision)
    : Math.abs(val);

  return val < 0 ? `-${formattedValue}` : formattedValue;
}

export default formatValue;
