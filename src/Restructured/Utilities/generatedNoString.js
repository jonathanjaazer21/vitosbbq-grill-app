export default function (no) {
  const newNo = no + 1
  if (newNo < 10) {
    return `0000${newNo}`
  } else if (newNo > 9 && newNo < 100) {
    return `000${newNo}`
  } else if (newNo > 99 && newNo < 1000) {
    return `00${newNo}`
  } else if (newNo > 1000 && newNo < 10000) {
    return `0${newNo}`
  } else {
    return newNo
  }
}
