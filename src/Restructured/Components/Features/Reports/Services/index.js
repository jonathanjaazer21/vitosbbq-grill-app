import { BRANCH, DATE_ORDER_PLACED } from "Restructured/Constants/schedules"
import db from "services/firebase"
export default class Services {
  static async getSchedules(branch, dateFromTo) {
    if (dateFromTo === null) return []
    const startTime = new Date(dateFromTo[0]?._d.setHours(0, 0, 0, 0))
    const endTime = new Date(dateFromTo[1]?._d.setHours(23, 59, 59, 59))
    // const endTime = new Date(
    //   dateFromTo[1]?._d.setDate(dateFromTo[1]?._d.getDate())
    // )
    return new Promise((resolve, reject) => {
      db.collection("schedules")
        .where("StartTime", ">=", startTime)
        .where("StartTime", "<=", endTime)
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push({ ..._data, _id: doc.id })
          })
          const filterByBranch = _dataFetched.filter(
            (data) => data[BRANCH] === branch
          )
          resolve(filterByBranch)
        })
        .catch((error) => {
          reject(error)
          console.log("Error getting documents: ", error)
        })
    })
  }
}
