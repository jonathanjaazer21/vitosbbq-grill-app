import db from "services/firebase"

export default class DropdownServices {
  static async getDropdowns(name) {
    return new Promise((res, rej) => {
      db.collection("dropdowns")
        .where("name", "==", name)
        .get()
        .then((querySnapshot) => {
          let _dataFetched = {}
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched = {
              ..._data,
            }
          })
          res(_dataFetched)
        })
        .catch((error) => {
          rej(error)
          console.log("Error getting documents: ", error)
        })
    })
  }

  static async getDropdownList() {
    return new Promise((res, rej) => {
      db.collection("dropdowns")
        .get()
        .then((querySnapshot) => {
          let _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push(_data)
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
