import db from "services/firebase"

export default class Commands {
  #collectionName
  #id
  #data
  #fieldName
  #fieldValue
  #orderBy
  constructor(args) {
    const {
      _collectionName,
      _id,
      _data = {},
      _fieldName = "",
      _fieldValue = "",
      _orderBy = "",
    } = args
    this.#collectionName = _collectionName
    this.#id = _id
    this.#data = _data
    this.#fieldName = _fieldName
    this.#fieldValue = _fieldValue
    this.#orderBy = _orderBy
  }

  async getData() {
    const ref = db.collection(this.#collectionName)
    const snapshot = await ref.get()
    if (snapshot.empty) {
      console.log("No matching documents.")
      return []
    }

    const data = []
    snapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    return data
  }

  async getDataWithId() {
    if (this.#id) {
      const ref = db.collection(this.#collectionName).doc(this.#id)
      const doc = await ref.get()
      if (!doc.exists) {
        return {}
      } else {
        const data = { ...doc.data() }
        return data
      }
    }
    return {}
  }

  getDataWithFieldName() {
    return new Promise((resolve, reject) => {
      db.collection(this.#collectionName)
        .where(this.#fieldName, "==", this.#fieldValue)
        .orderBy(this.#orderBy, "desc")
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

  async mergeData() {
    const ref = db.collection(this.#collectionName).doc(this.#id)
    const setWithMerge = ref.set(
      {
        ...this.#data,
      },
      { merge: true }
    )
  }

  async updateData() {
    if (this.#id) {
      console.log(`Updated ${this.#id}`, this.#data)
    }
  }

  async deleteData() {
    if (this.#id) {
      console.log(`Deleted ${this.#id}`, this.#data)
    }
  }
}
