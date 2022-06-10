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
  setDoc,
  startAt,
  endAt,
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
      orderBy(orderedBy[0], orderedBy[1])
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
        console.log("docSnap", docSnap.data())
        return docSnap.data()
      } else {
        return {}
      }
    } catch (error) {
      throw new Error(error.code)
    }
  }

  static async getDataByDate(collectionName, dates, fieldname, branch) {
    const startTime = new Date(dates[0].setHours(0, 0, 0, 0))
    const endTime = new Date(dates[1].setHours(23, 59, 59, 59))
    const q = query(
      collection(db, collectionName),
      where(fieldname, ">=", startTime),
      where(fieldname, "<=", endTime),
      where("branch", "==", branch),
      orderBy(fieldname, "asc")
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

  // only for filter panel of dashboard scheduler
  static async getDataByDatePanel(collectionName, dates, fieldname, branch) {
    const startTime = new Date(dates[0].setHours(0, 0, 0, 0))
    const endTime = new Date(dates[1].setHours(23, 59, 59, 59))
    const q = query(
      collection(db, collectionName),
      where(fieldname, ">=", startTime),
      where(fieldname, "<=", endTime),
      where("branch", "==", branch),
      orderBy(fieldname, "asc")
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

  static async getDataByFieldname(collectionName, fieldname, value, branch) {
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

  static async getDataByFieldnameWithBranch(
    collectionName,
    fieldname,
    value,
    branch
  ) {
    const q = query(
      collection(db, collectionName),
      where(fieldname, "==", value),
      where("branch", "==", branch)
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

  static async getDataByKeyword(collectionName, fieldname, value) {
    const q = query(
      collection(db, collectionName),
      orderBy(fieldname),
      startAt(value),
      endAt(fieldname + "\uf8ff")
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

  static async getDataNotEqualToFieldname(
    collectionName,
    orderedBy,
    fieldname,
    value
  ) {
    const q = query(
      collection(db, collectionName),
      where(fieldname, "!=", value),
      orderBy(fieldname),
      orderBy(orderedBy[0], orderedBy[1])
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
    console.log(collectionName, data)
    try {
      const docRef = await addDoc(collection(db, collectionName), { ...data })
      if (docRef?.id) {
        return { ...data, _id: docRef.id }
      }
      return {}
    } catch (error) {
      throw new Error(error)
    }
  }

  static async setData(collectionName, id, data) {
    try {
      return await setDoc(
        doc(db, collectionName, id),
        {
          ...data,
        },
        { merge: true }
      )
    } catch (error) {
      throw new Error(error.code)
    }
  }

  static async updateDataById(collectionName, id, data) {
    console.log("id", id)
    console.log("data to be updated", data)
    try {
      const docRef = doc(db, collectionName, id)
      updateDoc(docRef, {
        ...data,
      })
    } catch (err) {
      console.log("error during update", err)
      throw new Error(err.code)
    }
  }

  static async setDataById(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id)
      setDoc(
        docRef,
        {
          ...data,
        },
        { merge: true }
      )
    } catch (err) {
      throw new Error(err.code)
    }
  }
}
