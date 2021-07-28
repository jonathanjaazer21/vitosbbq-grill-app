import { formatDateDash } from "Restructured/Utilities/dateFormat"
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

  static async getRRById(id) {
    const ref = db.collection("receivingReports").doc(id)
    const doc = await ref.get()
    if (!doc.exists) {
      return {}
    } else {
      const data = { ...doc.data() }
      delete data.date
      return data
    }
    // return new Promise((res, rej) => {
    // db.collection("receivingReports")
    //   .doc(id)
    //   .get()
    //   .then((querySnapshot) => {
    //     const
    //     console.log("query", querySnapshot)
    //     const _dataFetched = []
    //     querySnapshot.forEach((doc) => {
    //       const _data = doc.data()
    //       _dataFetched.push({
    //         ..._data,
    //       })
    //     })
    //     res(_dataFetched)
    //   })
    //   .catch((error) => {
    //     rej(error)
    //     console.log("Error getting documents: ", error)
    //   })
    // })
  }

  static async getRR() {
    return new Promise((res, rej) => {
      db.collection("receivingReports")
        .orderBy("date", "desc")
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

  static async getRRByGeneratedNoObj(branch) {
    console.log("B", branch)
    const date = formatDateDash(new Date())
    const dateString = date.split("-").join("")
    return new Promise((res, rej) => {
      db.collection("receivingReports")
        .where("branch", "==", branch)
        .where("dateString", "==", dateString)
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
