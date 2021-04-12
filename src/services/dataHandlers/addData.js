import db from '../firebase'

export default function ({ data, collection, id = null }) {
  if (!id) {
    return new Promise((resolve, reject) => {
      db.collection(collection).add({ ...data })
        .then((docRef) => {
          resolve(docRef.id)
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
          reject(error)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      db.collection(collection).doc(id).set({ ...data })
        .then(() => {
          resolve('success')
          console.log('Document successfully written!')
        })
        .catch((error) => {
          reject(error)
          console.error('Error writing document: ', error)
        })
    })
  }
}
