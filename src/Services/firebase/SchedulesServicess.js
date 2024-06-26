import Commands from "./base"
import db, {
  query,
  where,
  collection,
  orderBy,
  getDocs,
} from "Services/firebase"
import { reject } from "lodash"
import { UNAVAILABLE } from "Constants/errorCodes"
const collectionName = "schedules"
export default class ScheduleServicess extends Commands {
  #dateFrom
  #dateTo
  #dateField
  #orderBy
  #forOrderNo
  constructor(args) {
    const {
      _id = "",
      _data = {},
      _dateRange = [new Date(), new Date()],
      _dateField = "",
      _orderBy = "",
      _forOrderNo = ["", "", ""],
    } = args
    super({
      _collectionName: collectionName,
      _id,
      _data,
    })
    this.#dateFrom = _dateRange[0]
    this.#dateTo = _dateRange[1]
    this.#dateField = _dateField
    this.#orderBy = _orderBy
    this.#forOrderNo = _forOrderNo
  }

  async getRange() {
    const _startTime = new Date(this.#dateFrom.setHours(0, 0, 0, 0))
    const _endTime = new Date(this.#dateTo.setHours(23, 59, 59, 59))
    const req = query(
      collection(db, collectionName),
      where(this.#dateField, ">=", _startTime),
      where(this.#dateField, "<=", _endTime),
      orderBy(this.#orderBy, "desc")
    )
    const querySnapshot = await getDocs(req)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    console.log("responsedata", data)
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    console.log("responsedata", data)
    return data
    // db.collection(collectionName)
    //   .where(this.#dateField, ">=", _startTime)
    //   .where(this.#dateField, "<=", _endTime)
    //   .orderBy(this.#orderBy, "desc")
    //   .get()
    //   .then((querySnapshot) => {
    //     const _dataFetched = []
    //     querySnapshot.forEach((doc) => {
    //       const _data = doc.data()
    //       _dataFetched.push({ ..._data, _id: doc.id })
    //     })
    //     resolve(_dataFetched)
    //   })
    //   .catch((error) => {
    //     reject(error)
    //     console.log("Error getting documents: ", error)
    //   })
  }

  async getGeneratedIdToday() {
    console.log(`${this.#forOrderNo[0]}-${this.#forOrderNo[1]}-685`)
    console.log(`${this.#forOrderNo[0]}-${this.#forOrderNo[2]}-685`)
    return new Promise((resolve, reject) => {
      db.collection(collectionName)
        .where(
          "orderNo",
          "<=",
          `${this.#forOrderNo[0]}-${this.#forOrderNo[1]}-685`
        )
        .where(
          "orderNo",
          ">",
          `${this.#forOrderNo[0]}-${this.#forOrderNo[2]}-685`
        )
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
