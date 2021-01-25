import db from '../firebase'

export default function ({ data, collection, id }) {
  const cityRef = db.collection(collection).doc(id)
  const setWithMerge = cityRef.set(
    {
      ...data
    },
    { merge: true }
  )
}
