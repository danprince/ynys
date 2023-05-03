export const cardinalDirections = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function removeFromArray<T>(array: T[], element: T) {
  let index = array.indexOf(element);
  if (index >= 0) array.splice(index, 1);
}

export function lerp(v0: number, v1: number, v: number): number {
  return v0 + (v1 - v0) * v;
}
