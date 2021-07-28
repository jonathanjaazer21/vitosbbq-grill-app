export const replace = (array, index, value) => {
  if (typeof array[index] !== "undefined") {
    console.log("replace", array)
    console.log("valuere", value)
    return array.splice(index, 1, value)
  }
  array.push(value)
  return array
}

export const replaceArrayData = (array, index, value) => {
  const _array = []
  for (const data of array) {
    _array.push({ ...data })
  }
  if (typeof _array[index] !== "undefined") {
    const newArray = _array.splice(index, 1, value)
    return newArray
  }
  return array
}
