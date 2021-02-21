import db from '../firebase'

export default function ({ id, collection }) {
  db.collection(collection)
    .doc(id)
    .delete()
    .then(data => {
      console.log('Document successfully deleted!')
    })
    .catch(error => {
      console.error('Error removing document: ', error)
    })
}
