// this function component is a special case

import React, { useState, useEffect } from "react"
import Input from "./input"
import styled from "styled-components"
import {
  LABELS,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  PARTNER_MERCHANT_ORDER_NO,
} from "components/SchedulerComponent/orderSlip/types"
import DropdownList from "./dropdownList"
import { useSelector } from "react-redux"
import { selectOrderComponentSlice } from "components/SchedulerComponent/orderSlip/orderSlipSlice"

const Container = styled.div`
  display: ${(props) => (props.isDisplayed ? "flex" : "flex")};
  justify-content: flex-start;
  width: 100%;
  position: relative;
`
const Left = styled.div`
  width: 50%;

  label {
    color: #888;
  }
`

const Right = styled.div`
  width: 50%;
  position: absolute;
  right: -0.9rem;

  label {
    color: #888;
  }
`

function OrderVia(props) {
  const orderComponentSlice = useSelector(selectOrderComponentSlice)
  const [isPartnerMerchant, setPartnerMerchant] = useState(false)
  const [newProps, setNewProps] = useState(props)
  const [secondFieldValue, setSecondFieldValue] = useState("")
  const [isDisplayed, setIsDisplayed] = useState(false)
  // const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    setNewProps(props)
    // reStructureDataSource()
    setSecondFieldValue(props[PARTNER_MERCHANT_ORDER_NO])
  }, [props])

  // const reStructureDataSource = () => {
  //   const newDataSource =
  //     props?.label === LABELS[ORDER_VIA]
  //       ? props.dataSource.filter((data) => data.Category === 'Direct')
  //       : props.dataSource.filter(
  //         (data) => data.Category === 'Partner Merchant'
  //       )

  //   setDataSource(newDataSource)
  // }

  useEffect(() => {
    loadDisplayedSetting()
  }, [orderComponentSlice.orderViaField])

  const loadDisplayedSetting = () => {
    if (orderComponentSlice.orderViaField) {
      if (orderComponentSlice.orderViaField.includes("Direct")) {
        setIsDisplayed(false)
      } else if (
        orderComponentSlice.orderViaField.includes("Partner Merchant")
      ) {
        setIsDisplayed(true)
      } else {
        setIsDisplayed(true)
      }
    } else {
      setIsDisplayed(true)
    }
  }
  return (
    <Container>
      <Left>
        <label>{LABELS[ORDER_VIA_PARTNER]}</label>
        <DropdownList
          {...newProps}
          enabled={props?.enabled}
          value={newProps[ORDER_VIA_PARTNER]}
          name={ORDER_VIA_PARTNER}
          id={ORDER_VIA_PARTNER}
          change={props?.onChange}
        />
      </Left>
      <Right>
        <label>{LABELS[PARTNER_MERCHANT_ORDER_NO]}</label>
        <Input
          {...newProps}
          name={PARTNER_MERCHANT_ORDER_NO}
          disabled={!isDisplayed}
          value={secondFieldValue}
          onChange={(e) => {
            setSecondFieldValue(e.target.value)
          }}
        />
      </Right>
    </Container>
  )
}

export default OrderVia
