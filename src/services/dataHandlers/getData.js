import db from '../firebase'
export default function (collectionName, document = null) {
  if (!document) {
    return new Promise((resolve, reject) => {
      db.collection(collectionName).get().then((querySnapshot) => {
        const data = []
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            data.push({ ...doc.data(), _id: doc.id })
          } else {
            console.log('No such document!')
            resolve(null)
          }
        })
        resolve(data)
      }).catch((error) => {
        reject([])
        console.log('Error getting document:', error)
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      db.collection(collectionName).doc(document).get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data()
            resolve(data)
          } else {
            console.log('No such document!d')
            resolve(null)
          }
          resolve(null)
        }).catch((error) => {
          reject(error)
          console.log('Error getting document:', error)
        })
    })
  }
}
