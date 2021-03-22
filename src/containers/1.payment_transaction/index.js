import React, { useEffect, useState } from 'react'
import ScheduleComponent from 'components/SchedulerComponent'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from '../styles'
import Sidenav from 'components/sideNav'
import Animate, { FadeIn } from 'animate-css-styled-components'
import { useDispatch } from 'react-redux'
import { navigateTo } from 'components/sideNav/sideNavSlice'
import {
  DASHBOARD,
  PAYMENT_TRANSACTION
} from 'components/sideNav/2.menu/menuData'
import Table from 'components/Table'
import { clearTable, setTable, updateTable } from 'components/Table/tableSlice'
import db from 'services/firebase'
import { ACCOUNT_NAME, BRANCH, CONTACT_NUMBER, CUSTOMER, DATE_END, DATE_ORDER_PLACED, DATE_START, LABELS, ORDER_NO } from 'components/SchedulerComponent/orderSlip/types'
import { SCHEDULES } from 'services/collectionNames'
import { formatDate, normalizeHour } from 'components/print'
import PaymentDetails from 'components/PaymentDetails'
import getAmount from 'commonFunctions/getAmount'
import calculateSubTotal from 'commonFunctions/calculateSubTotal'
import { menu } from 'components/SchedulerComponent/orderSlip/orderSlip'
import { ACCOUNT_NUMBER, AMOUNT_PAID, DATE_PAYMENT, MODE_PAYMENT, PAYMENT_LABELS, SOURCE } from 'components/PaymentDetails/types'
const formatDateFromFirebase = date => {
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}
function UserMasterfile () {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)
  const [openId, setOpenId] = useState('')
  const [columnWidth, setColumnWidth] = useState('')

  const widths = {
    [BRANCH]: '120',
    [ORDER_NO]: '200',
    [DATE_ORDER_PLACED]: '150',
    [ACCOUNT_NAME]: '150',
    [CUSTOMER]: '200',
    [CONTACT_NUMBER]: '150',
    [DATE_START]: '200',
    [DATE_END]: '200',
    [DATE_PAYMENT]: '200',
    [MODE_PAYMENT]: '200',
    [SOURCE]: '200',
    [ACCOUNT_NUMBER]: '200',
    [AMOUNT_PAID]: '200'
  }
  useEffect(() => {
    dispatch(navigateTo([DASHBOARD, PAYMENT_TRANSACTION]))
    const unsubscribe = db.collection(SCHEDULES).onSnapshot(function (snapshot) {
      const rows = []
      const headers = [...[ORDER_NO, BRANCH, DATE_ORDER_PLACED, ACCOUNT_NAME, CUSTOMER, CONTACT_NUMBER, DATE_START, DATE_END].map(fieldName => {
        return {
          field: fieldName,
          headerText: LABELS[fieldName],
          width: widths[fieldName]
        }
      }),
      {
        field: 'totalQty',
        headerText: 'Total Qty'
      },
      {
        field: 'totalAmount',
        headerText: 'Total Amount'
      },
      ...[DATE_PAYMENT, MODE_PAYMENT, SOURCE, ACCOUNT_NUMBER, AMOUNT_PAID].map(fieldName => {
        return {
          field: fieldName,
          headerText: PAYMENT_LABELS[fieldName],
          width: widths[fieldName]
        }
      })
      ]
      for (const obj of snapshot.docChanges()) {
        if (obj.type === 'modified') {
          const data = obj.doc.data()
          const dateOrderPlaced = formatDateFromFirebase(data[DATE_ORDER_PLACED])
          const dateStart = formatDateFromFirebase(data[DATE_START])
          const dateEnd = formatDateFromFirebase(data[DATE_END])
          const datePayment = typeof data[DATE_PAYMENT] !== 'undefined' ? formatDateFromFirebase(data[DATE_PAYMENT]) : ''
          const totals = {}
          for (const field of menu) {
            totals[field] = { qty: data[field], price: getAmount(field) }
          }
          const result = calculateSubTotal(totals)
          const newData = {
            ...data,
            _id: obj.doc.id,
            [DATE_ORDER_PLACED]: formatDate(dateOrderPlaced),
            [DATE_START]: normalizeHour(dateStart),
            [DATE_END]: normalizeHour(dateEnd),
            [DATE_PAYMENT]: datePayment !== '' ? formatDate(datePayment) : '',
            totalQty: result?.qty,
            totalAmount: result?.subTotal
          }
          dispatch(updateTable({ data: newData, id: obj.doc.id }))
        } else if (obj.type === 'added') {
          const data = obj.doc.data()
          const dateOrderPlaced = formatDateFromFirebase(data[DATE_ORDER_PLACED])
          const dateStart = formatDateFromFirebase(data[DATE_START])
          const dateEnd = formatDateFromFirebase(data[DATE_END])
          const datePayment = typeof data[DATE_PAYMENT] !== 'undefined' ? formatDateFromFirebase(data[DATE_PAYMENT]) : ''
          const totals = {}
          for (const field of menu) {
            totals[field] = { qty: data[field], price: getAmount(field) }
          }
          const result = calculateSubTotal(totals)
          rows.push({
            ...data,
            _id: obj.doc.id,
            [DATE_ORDER_PLACED]: formatDate(dateOrderPlaced),
            [DATE_START]: normalizeHour(dateStart),
            [DATE_END]: normalizeHour(dateEnd),
            [DATE_PAYMENT]: datePayment !== '' ? formatDate(datePayment) : '',
            totalQty: result?.qty,
            totalAmount: result?.subTotal
          })
        } else if (obj.type === 'removed') {
          // dispatch(deleteTable({ _id: obj.doc.id }))
        } else {
          console.log('nothing', obj.type)
        }
      }
      if (rows.length > 0) {
        dispatch(setTable({ rows, headers }))
      }
    })

    return () => {
      unsubscribe()
      dispatch(clearTable())
    }
  }, [])

  useEffect(() => {
    setTimeout(function () {
      setColumnWidth('500')
      setColumnWidth('1600')
    }, 2000)
  }, [])

  const sortSettings = {
    columns: [{ field: ORDER_NO, direction: 'Ascending' }]
  }
  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={['1s']} delay={['0.2s']}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <Table toolbar={['Search']} rowSelected={(e) => setOpenId(e.data._id)} height='100%' width={columnWidth} sortSettings={sortSettings} />

            {openId && <div style={{ position: 'fixed', top: '4.3rem', width: 'calc(100% - 320px)', height: '100%' }}><PaymentDetails id={openId} handleBack={() => setOpenId('')} /></div>}

          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default UserMasterfile
