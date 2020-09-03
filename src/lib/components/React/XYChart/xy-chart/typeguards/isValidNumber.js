export default function isValidNumber(_) {
  return _ != null && typeof _ === "number" && !isNaN(_) && isFinite(_);
}
