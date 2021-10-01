import SchedulesServicess from "services/firebase/SchedulesServicess"
import orderNoDate from "./orderNoDate"
export default function useOrderNoCounter() {
  const addDigits = (number) => {
    if (number >= 0 && number < 9) {
      return `00${number + 1}`
    } else if (number >= 9 && number < 99) {
      return `0${number + 1}`
    } else {
      return number + 1
    }
  }
  const handleCount = async (branch) => {
    if (!branch) return null
    const dateNow = new Date()
    dateNow.setDate(dateNow.getDate() + 1)
    const orderNo = orderNoDate(dateNow)
    const branchCode = branch === "Ronac" ? "RSJ002" : "LB001"
    const service = new SchedulesServicess({
      _forOrderNo: [branchCode, orderNo, orderNoDate()],
    })
    try {
      const data = await service.getGeneratedIdToday()
      if (data.length > 0) {
        return `${branchCode}-${orderNoDate()}-685${addDigits(data.length)}`
      } else {
        return `${branchCode}-${orderNoDate()}-${685001}`
      }
    } catch {
      console.log("something went wrong")
      return null
    }
  }

  return [handleCount]
}
