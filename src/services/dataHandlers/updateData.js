import db from "../firebase"

export default function ({ data, collection, id }) {
  const ref = db.collection(collection).doc(id)
  const setWithMerge = ref.set(
    {
      ...data,
    },
    { merge: true }
  )
}

export const update = ({ data, collection, id }) => {
  const ref = db.collection(collection).doc(id)
  ref.update({
    ...data,
  })
}
