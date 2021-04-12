export default (array, field) => {
  return array.sort((a, b) => a[field] - b[field])
}
