export default function isDefined(_: unknown): _ is number {
  return typeof _ !== "undefined" && _ !== null;
}
