export const sortByNumber = (array, field) => {
  return array.sort((a, b) => {
    const numA = Number(a[field]) || 0 // if a[field] is equal to null or do not have a value
    const numB = Number(b[field]) || 0 // if a[field] is equal to null or do not have a value
    if (numA < numB) {
      return -1
    }
    if (numA > numB) {
      return 1
    }
    return 0
  })
}
export const sortArray = (array, order = "asc") => {
  if (order === "asc") {
    return array.sort(function (a, b) {
      return a - b
    })
  }
  return array.sort(function (a, b) {
    return b - a
  })
}

export default function (array, field) {
  return array.sort((a, b) => {
    if (a[field] < b[field]) {
      return -1
    }
    if (a[field] > b[field]) {
      return 1
    }
    return 0
  })
}
