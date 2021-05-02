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
