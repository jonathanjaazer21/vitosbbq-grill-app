import { useEffect, useState } from 'react'
import db from 'services/firebase'

export function useGetBranches(branchName) {
  const [branches, setBranches] = useState({})

  useEffect(() => {
    if (branchName) {
      db.collection('branches').where('branchName', '==', branchName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, ' => ', doc.data())
            setBranches(doc.data())
          })
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
        })
    }
  }, [branchName])

  return branches
}
