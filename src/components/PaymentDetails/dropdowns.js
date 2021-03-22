import { useState, useEffect } from 'react'
import db from 'services/firebase'
import { ACCOUNT_NUMBER, MODE_PAYMENT, SOURCE } from './types'

const getWhereData = (name) => {
  return new Promise((resolve, reject) => {
    db.collection('dropdowns')
      .where('name', '==', name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const data = doc.data()
            resolve(data.list)
          } else {
            resolve([])
          }
        })
        resolve([])
      }).catch((error) => {
        console.log('Error getting document:', error)
        reject(error)
      })
  })
}

export function useGetDropdowns() {
  const [dropdowns, setDropdowns] = useState({
    [SOURCE]: [],
    [MODE_PAYMENT]: [],
    [ACCOUNT_NUMBER]: []
  })

  useEffect(() => {
    loadDropdowns()
  }, [])

  const loadDropdowns = async () => {
    const source = await getWhereData(SOURCE)
    const accountNumber = await getWhereData(ACCOUNT_NUMBER)
    const modePayment = await getWhereData(MODE_PAYMENT)
    setDropdowns({ ...dropdowns, [SOURCE]: source, [ACCOUNT_NUMBER]: accountNumber, [MODE_PAYMENT]: modePayment })
  }
  return dropdowns
}
