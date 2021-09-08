import { useState, useEffect } from "react"
import {
  BRANCH,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  PAYMENT_MODE,
  STATUS,
} from "./orderSlip/types"
import db from "services/firebase"
import { getData } from "services"
import { BRANCHES } from "services/collectionNames"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.login/loginSlice"

const getWhereData = (name) => {
  return new Promise((resolve, reject) => {
    db.collection("dropdowns")
      .where("name", "==", name)
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
      })
      .catch((error) => {
        console.log("Error getting document:", error)
        reject(error)
      })
  })
}

const getBranch = async () => {
  const data = []
  const result = await getData(BRANCHES)
  for (const obj of result) {
    data.push(obj?.branchName)
  }
  return data
}

export function useGetDropdowns() {
  const userSlice = useSelector(selectUserSlice)
  const [dropdowns, setDropdowns] = useState({
    [STATUS]: [],
    [PAYMENT_MODE]: [],
    [ORDER_VIA]: [],
    [BRANCH]: [],
    [ORDER_VIA_PARTNER]: [],
  })

  useEffect(() => {
    loadDropdowns()
  }, [])

  const loadDropdowns = async () => {
    const status = await getWhereData(STATUS)
    const orderVia = await getWhereData(ORDER_VIA)
    const paymentMode = await getWhereData(PAYMENT_MODE)
    const orderViaPartner = await getWhereData(ORDER_VIA_PARTNER)
    const branch = userSlice.branches
    setDropdowns({
      ...dropdowns,
      [STATUS]: status,
      [ORDER_VIA]: ["", ...orderVia],
      [PAYMENT_MODE]: paymentMode,
      [BRANCH]: branch,
      [ORDER_VIA_PARTNER]: ["", ...orderViaPartner],
    })
  }
  return dropdowns
}
