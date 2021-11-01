import db from "services/firebase"
import {
  formatDateFromDatabase,
  formatDateDash,
} from "Restructured/Utilities/dateFormat"
export default class PaginateCommands {
  static async getData(collectionName, limit = 30, branch) {
    const collection = db
      .collection(collectionName)
      .where("branch", "==", branch)
      // .orderBy("StartTime", "desc")
      .limit(limit)
    return new Promise((resolve, reject) => {
      collection.get().then((documentSnapshots) => {
        let colData = []
        // set the last visible document that will be use in getMoreData
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1]

        documentSnapshots.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const dateFromD = formatDateFromDatabase(doc.data()?.StartTime)
          const docData = { ...doc.data(), _id: doc.id }
          colData.push(docData)
        })
        resolve([lastVisible, colData])
      })
    })
  }

  static async getMoreData(collectionName, limit = 30, lastVisible, branch) {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    return new Promise((resolve, reject) => {
      const next = db
        .collection(collectionName)
        .where("branch", "==", branch)
        // .orderBy("StartTime", "desc")
        .startAfter(lastVisible)
        .limit(limit)

      next.get().then((documentSnapshots) => {
        let colData = []
        let _lastVisible = null
        documentSnapshots.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const dateFromD = formatDateFromDatabase(doc.data()?.StartTime)
          const docData = { ...doc.data(), _id: doc.id }
          _lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          console.log(doc.id, " => ", docData)
          colData.push(docData)
        })
        console.log("colData", colData)
        resolve([_lastVisible, colData])
      })
    })
  }
}
