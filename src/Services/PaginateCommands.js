import db, {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  orderBy,
  query,
  where,
  updateDoc,
  limit,
  startAfter,
  setDoc,
} from "./firebase"
import { formatDateFromDatabase, formatDateDash } from "Helpers/dateFormat"
import { UNAVAILABLE } from "Constants/errorCodes"
export default class PaginateCommands {
  static async getData(
    collectionName,
    customLimit = 150,
    branch,
    customSort = []
  ) {
    const ref = collection(db, collectionName)
    if (branch) {
      const request = query(
        ref,
        where("branch", "==", branch),
        orderBy(customSort[0], customSort[1]),
        limit(customLimit)
      )
      const querySnapshot = await getDocs(request)
      // use .metadata.fromCache of firebase instead since try catch is not working here
      if (querySnapshot.metadata.fromCache) {
        throw new Error(UNAVAILABLE)
      }

      const _lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), _id: doc.id })
      })
      return [_lastVisible, data]
    } else {
      const request = query(
        ref,
        orderBy(customSort[0], customSort[1]),
        limit(customLimit)
      )
      const querySnapshot = await getDocs(request)
      // use .metadata.fromCache of firebase instead since try catch is not working here
      if (querySnapshot.metadata.fromCache) {
        throw new Error(UNAVAILABLE)
      }

      const _lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), _id: doc.id })
      })
      return [_lastVisible, data]
    }
  }

  static async getMoreData(
    collectionName,
    customLimit = 150,
    lastVisible,
    branch,
    customSort = []
  ) {
    const ref = collection(db, collectionName)
    if (branch) {
      const request = query(
        ref,
        where("branch", "==", branch),
        orderBy(customSort[0], customSort[1]),
        startAfter(lastVisible),
        limit(customLimit)
      )
      const querySnapshot = await getDocs(request)
      // use .metadata.fromCache of firebase instead since try catch is not working here
      if (querySnapshot.metadata.fromCache) {
        throw new Error(UNAVAILABLE)
      }

      const _lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), _id: doc.id })
      })
      return [_lastVisible, data]
    } else {
      const request = query(
        ref,
        where("branch", "==", branch),
        orderBy(customSort[0], customSort[1]),
        startAfter(lastVisible),
        limit(customLimit)
      )
      const querySnapshot = await getDocs(request)
      // use .metadata.fromCache of firebase instead since try catch is not working here
      if (querySnapshot.metadata.fromCache) {
        throw new Error(UNAVAILABLE)
      }

      const _lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), _id: doc.id })
      })
      return [_lastVisible, data]
    }
  }
}
