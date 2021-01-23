import db from '../firebase'

export default function ({ data, collection }) {
  const ref = db.collection(collection).doc()

  const setWithMerge = ref.set(
    {
      ...data
    },
    { merge: true }
  )
}
