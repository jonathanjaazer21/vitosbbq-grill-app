import db from "services/firebase"

export default class ReceivingReportServices {
  static async getRRByCode(code) {
    return new Promise((res, rej) => {
      db.collection("receivingReports")
        .where(code, "!=", "0")
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push({
              ..._data,
            })
          })
          res(_dataFetched)
        })
        .catch((error) => {
          rej(error)
          console.log("Error getting documents: ", error)
        })
    })
  }

  static async getRR() {
    return new Promise((res, rej) => {
      db.collection("receivingReports")
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push({
              ..._data,
              _id: doc.id,
            })
          })
          res(_dataFetched)
        })
        .catch((error) => {
          rej(error)
          console.log("Error getting documents: ", error)
        })
    })
  }
}
