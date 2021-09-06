export default function (data, code) {
  let purchases = 0

  for (const obj of data) {
    purchases = purchases + parseInt(obj[code])
  }

  return purchases
}

export const produceTotalImports = (data, code) => {
  let purchases = 0

  for (const obj of data) {
    purchases = purchases + parseInt(obj[code])
  }

  return purchases
}
