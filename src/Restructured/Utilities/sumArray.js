import thousandsSeparators from "./formatNumber"

export default function (array, field) {
  // Getting sum of numbers
  if (array.length > 0) {
    if (field) {
      const sum = array.reduce(function (a = 0, b) {
        let fieldNumber = typeof b[field] !== "undefined" ? b[field] : 0
        return Number(a) + Number(fieldNumber)
      }, 0)
      return sum
    }
    const sum = array.reduce(function (a, b) {
      return Number(a) + Number(b)
    }, 0)
    return sum
  }
  return 0
}

export const sumArrayDatas = (array, index) => {
  if (array.length > 0) {
    const sum = array.reduce(function (a = 0, b) {
      if (typeof b[index] === "number") {
        return parseInt(a) + parseInt(b[index])
      }
      if (b[index]) {
        if (!isNaN(b[index])) {
          return parseInt(a) + parseInt(b[index])
        } else {
          return parseInt(a) + 0
        }
      } else {
        return parseInt(a) + 0
      }
    }, 0)
    return sum
  }
  return 0
}

// to group the same name of value in an object
export const sumArrayOfObjectsGrouping = (data, field1, field2) => {
  const newDataByGroup = []
  data.forEach((obj) => {
    console.log(obj[field1], obj[field2])
    let newDataByGroupIndex = 0

    // check first if data already exist
    const dataExist = newDataByGroup.find((d, index2) => {
      if (typeof d[field1] !== "undefined") {
        if (d[field1] === obj[field1]) {
          newDataByGroupIndex = index2
        }
        return d[field1] === obj[field1]
      }
    })

    if (dataExist) {
      const number1 = Number(dataExist[field2])
      const number2 = Number(obj[field2])
      console.log("number", dataExist[field2])
      console.log(number1, number2)
      const sumNumber = number1 + number2
      const renewedData = {
        // ...obj,
        // [field2]: sumNumber.toFixed(2),
        [field1]: obj[field1],
        [field2]: sumNumber.toFixed(2),
      }
      newDataByGroup.splice(newDataByGroupIndex, 1, renewedData)
    } else {
      const number = Number(obj[field2])
      newDataByGroup.push({
        // ...obj,
        // [field2]: number.toFixed(2),
        [field1]: obj[field1],
        [field2]: number.toFixed(2),
      })
    }
  })
  console.log("newDataByGroup", newDataByGroup)
  return newDataByGroup
}

export const sumNumbers = (array) => {
  return array.reduce((a, b) => Number(a) + Number(b), 0)
}
