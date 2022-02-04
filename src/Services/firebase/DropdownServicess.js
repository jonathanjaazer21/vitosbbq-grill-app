import Commands from "./base"
import db from "Services/firebase"
const collectionName = "dropdowns"
export default class ScheduleServicess extends Commands {
  #fieldName
  #fieldValue
  constructor(args) {
    super({ ...args, _collectionName: collectionName })

    this.#fieldName = args._fieldName
    this.#fieldValue = args._fieldValue
  }

  getDataWithFieldName() {
    return new Promise((resolve, reject) => {
      db.collection(collectionName)
        .where(this.#fieldName, "==", this.#fieldValue)
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
      console.log("code error", error)
    })
  }
}
