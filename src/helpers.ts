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
