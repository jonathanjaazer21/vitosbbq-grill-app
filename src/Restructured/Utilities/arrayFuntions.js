export const replace = (array, index, value) => {
  if (typeof array[index] !== "undefined") {
    return array.splice(index, 1, value)
  }
  array.push(value)
  return array
}
