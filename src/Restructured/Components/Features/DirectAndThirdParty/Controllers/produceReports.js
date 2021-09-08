export default function (totalSumofItems) {
  const data = []
  for (const date of Object.keys(totalSumofItems)) {
    const dateData = { ...totalSumofItems[date] }
    const renewedObj = {}
    for (const orderVia of Object.keys(dateData)) {
      if (dateData[orderVia].length > 0) {
        renewedObj[orderVia] = [...dateData[orderVia]]
      }
    }
    console.log("r", renewedObj)
    if (Object.keys(renewedObj).length > 0) {
      data.push({ [date]: renewedObj })
    }
  }

  return data
}
