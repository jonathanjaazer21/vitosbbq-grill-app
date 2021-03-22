import db from '../firebase'

export default function ({ data, collection }) {
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
}
