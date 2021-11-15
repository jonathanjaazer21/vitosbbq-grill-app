import { UNAVAILABLE } from "Constants/errorCodes"
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
} from "./firebase"
export default class Base {
  static async getData(collectionName) {
    const q = query(collection(db, collectionName))
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    return data
  }

  static async getDataBySort(collectionName, orderedBy) {
    const q = query(
      collection(db, collectionName),
      orderBy(orderedBy[0], orderedBy[1]),
      limit(150)
    )
    const querySnapshot = await getDocs(q)
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
  }

  static async getDataById(collectionName, id) {
    if (!id) {
      return []
    }
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        return {}
      }
    } catch (error) {
      throw new Error(error.code)
    }
  }

  static async getDataByFieldname(collectionName, fieldname, value) {
    const q = query(
      collection(db, collectionName),
      where(fieldname, "==", value)
      // orderBy(orderedBy[0], orderedBy[1])
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    return data
  }

  static async addData(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), { ...data })
      if (docRef?.id) {
        return { ...data, _id: docRef.id }
      }
      return {}
    } catch (error) {
      throw new Error(error.code)
    }
  }

  static updateDataById(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id)
      updateDoc(docRef, {
        ...data,
      })
    } catch (err) {
      throw new Error(err.code)
    }
  }
}
