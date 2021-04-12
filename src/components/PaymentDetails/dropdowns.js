import { DATE_PICKER, DROP_DOWN_LIST, INPUT, NUMBER } from 'components/fields/types'
import { useState, useEffect } from 'react'
import db from 'services/firebase'
import { ACCOUNT_NUMBER, AMOUNT_PAID, DATE_PAYMENT, MODE_PAYMENT, PAYMENT_LABELS, REF_NO, SOURCE } from './types'

const getWhereData = (name) => {
  return new Promise((resolve, reject) => {
    db.collection('dropdowns')
      .where('name', '==', name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const data = doc?.data()
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

export function useGetDropdowns () {
  const [dropdowns, setDropdowns] = useState([])

  useEffect(() => {
    loadDropdowns()
  }, [])

  const loadDropdowns = async () => {
    const source = await getWhereData(SOURCE)
    const accountNumber = await getWhereData(ACCOUNT_NUMBER)
    const modePayment = await getWhereData(MODE_PAYMENT)
    setDropdowns([
      {
        name: DATE_PAYMENT,
        type: DATE_PICKER,
        label: PAYMENT_LABELS[DATE_PAYMENT]
      },
      {
        name: MODE_PAYMENT,
        type: DROP_DOWN_LIST,
        label: PAYMENT_LABELS[MODE_PAYMENT],
        dataSource: modePayment
      },
      {
        name: SOURCE,
        type: DROP_DOWN_LIST,
        label: PAYMENT_LABELS[SOURCE],
        dataSource: source
      },
      {
        name: REF_NO,
        type: INPUT,
        label: PAYMENT_LABELS[REF_NO]
      },
      {
        name: ACCOUNT_NUMBER,
        type: DROP_DOWN_LIST,
        label: PAYMENT_LABELS[ACCOUNT_NUMBER],
        dataSource: accountNumber
      },
      {
        name: AMOUNT_PAID,
        type: NUMBER,
        label: PAYMENT_LABELS[AMOUNT_PAID]
      }
    ])
  }
  return dropdowns
}
