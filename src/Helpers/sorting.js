export const sortByNumber = (array, field) => {
  return array.sort((a, b) => {
    const numA = Number(a[field])
    const numB = Number(b[field])
    if (numA < numB) {
      return -1
    }
    if (numA > numB) {
      return 1
    }
    return 0
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
