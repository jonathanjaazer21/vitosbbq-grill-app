import db from "services/firebase"

export default class ScheduleServices {
  static async getSchedules() {
    return new Promise((res, rej) => {
      db.collection("schedules")
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

  static async getSchedulesByIncidents() {
    return new Promise((res, rej) => {
      db.collection("schedules")
        .where("others.Incidents", "!=", "")
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

  static async getSchedulesByCode(code) {
    // if (!code) return []
    return new Promise((res, rej) => {
      db.collection("schedules")
        .where(code, "!=", "0")
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            console.log("As", doc)
            _dataFetched.push({
              ..._data,
            })
          })
          console.log("Datafetched", _dataFetched)
          res(_dataFetched)
        })
        .catch((error) => {
          rej(error)
          console.log("Error getting documents: ", error)
        })
    })
  }
}
