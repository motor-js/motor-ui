export function valueIfUndefined(val, alternative) {
  return typeof val !== "undefined" && val !== null ? val : alternative;
}
