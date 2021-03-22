import db from '../firebase'

export default function ({ id, collection }) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .doc(id)
      .delete()
      .then(data => {
        console.log('Document successfully deleted!')
        resolve('success')
      })
      .catch(error => {
        console.error('Error removing document: ', error)
        reject(error)
      })
  })
}
