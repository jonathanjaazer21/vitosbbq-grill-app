import db from "services/firebase"
export default class FirestoreCommands {
  static async getData() {}

  static async getDataById(collectionName, id) {
    if (id && collectionName) {
      const ref = db.collection(collectionName).doc(id)
      const doc = await ref.get()
      if (!doc.exists) {
        return {}
      } else {
        const data = { ...doc.data(), _id: doc.id }
        return data
      }
    }
    return {}
  }

  static async updateDataById(collectionName, id, data = {}) {
    const ref = db.collection(collectionName).doc(id)
    return new Promise((resolve, reject) => {
      ref
        .update({
          ...data,
        })
        .then((d) => {
          resolve(d)
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error)
          reject(error)
        })
    })
  }
}
