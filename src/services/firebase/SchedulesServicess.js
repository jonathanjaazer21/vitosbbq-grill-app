import Commands from "./base"
import db from "services/firebase"
import { reject } from "lodash"
const collectionName = "schedules"
export default class ScheduleServicess extends Commands {
  #dateFrom
  #dateTo
  #dateField
  #orderBy
  constructor(args) {
    const {
      _id = "",
      _data = {},
      _dateRange = [new Date(), new Date()],
      _dateField = "",
      _orderBy = "",
    } = args
    super({ _collectionName: collectionName, _id, _data })
    this.#dateFrom = _dateRange[0]
    this.#dateTo = _dateRange[1]
    this.#dateField = _dateField
    this.#orderBy = _orderBy
  }

  async getRange() {
    return new Promise((resolve, reject) => {
      const _startTime = new Date(this.#dateFrom.setHours(0, 0, 0, 0))
      const _endTime = new Date(this.#dateTo.setHours(23, 59, 59, 59))
      db.collection(collectionName)
        .where(this.#dateField, ">=", _startTime)
        .where(this.#dateField, "<=", _endTime)
        .orderBy(this.#orderBy, "desc")
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push({ ..._data, _id: doc.id })
          })
          resolve(_dataFetched)
        })
        .catch((error) => {
          reject(error)
          console.log("Error getting documents: ", error)
        })
    }).catch((error) => {
      reject(error)
      console.log("code error", error)
    })
  }
}
