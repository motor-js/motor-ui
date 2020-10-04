export function getX(l) {
  return typeof l?.x === "number" ? l?.x : 0;
}

export function getY(l) {
  return typeof l?.y === "number" ? l?.y : 0;
}

export function getSource(l) {
  return l?.source;
}

export function getTarget(l) {
  return l?.target;
}

export function getFirstItem(d) {
  return d?.[0];
}

export function getSecondItem(d) {
  return d?.[1];
}
