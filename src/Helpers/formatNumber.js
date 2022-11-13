export default function thousandsSeparators(num) {
  if (num) {
    const numParts = num.toString().split(".")
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return numParts.join(".")
  } else {
    return num
  }
}

export const replaceThousandsSeparator = (num) => {
  return num.replace(/,/g, "")
}
