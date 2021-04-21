import { useState, useEffect } from "react"
import { ORDER_VIA, ORDER_VIA_PARTNER } from "./types"
import { useDispatch, useSelector } from "react-redux"
import { selectOrderComponentSlice, setOrderViaField } from "./orderSlipSlice"

export function useOrderViaField() {
  const dispatch = useDispatch()
  const [isDisplayedDirect, setIsDisplayedDirect] = useState(true)
  const [isDisplayedPartner, setIsDisplayedPartner] = useState(true)
  const orderComponentSlice = useSelector(selectOrderComponentSlice)

  useEffect(() => {
    loadDisplayedSetting()
  }, [orderComponentSlice.orderViaField])

  const loadDisplayedSetting = () => {
    if (orderComponentSlice.orderViaField) {
      if (orderComponentSlice.orderViaField.includes("Partner Merchant")) {
        setIsDisplayedDirect(false)
        setIsDisplayedPartner(true)
      } else {
        setIsDisplayedDirect(true)
        setIsDisplayedPartner(false)
      }
    } else {
      // setIsDisplayed(true)
    }
  }

  const handleOrderVia = (e, props) => {
    if (e) {
      if (props.name === ORDER_VIA) {
        if (e.value === null) {
          dispatch(setOrderViaField(e.value))
        } else {
          dispatch(setOrderViaField(`Direct ${e.value}`))
        }
      }
      if (props.name === ORDER_VIA_PARTNER) {
        if (e.value === null) {
          dispatch(setOrderViaField(e.value))
        } else {
          dispatch(setOrderViaField(`Partner Merchant ${e.value}`))
        }
      }
    }
  }
  return [isDisplayedDirect, isDisplayedPartner, handleOrderVia]
}
