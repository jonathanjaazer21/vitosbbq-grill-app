import { ACCOUNT_NAME, BRANCH, CONTACT_NUMBER, CUSTOMER, DATE_END, DATE_ORDER_PLACED, DATE_START, INDICATE_REASON, LABELS, ORDER_NO, ORDER_VIA, STATUS } from 'components/SchedulerComponent/orderSlip/types'
import React, { useEffect, useState } from 'react'
import { SCHEDULES } from 'services/collectionNames'
import db from 'services/firebase'
import { Wrapper, Container, Panel, Paper, Body, Description, Label, Label2, Actions } from './styles'
import { formatDate, normalizeHour } from 'components/print'
import { menu } from 'components/SchedulerComponent/orderSlip/orderSlip'
import { BiArrowBack } from 'react-icons/bi'
import calculateSubTotal from 'commonFunctions/calculateSubTotal'
import getAmount from 'commonFunctions/getAmount'
import { Paymentform } from './paymentForm'

const formatDateFromFirebase = date => {
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}
export default function PaymentDetails (props) {
  const [data, setData] = useState({})
  const [totals, setTotals] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [qty, setQty] = useState(0)
  useEffect(() => {
    loadData(props?.id)
  }, [props?.id])

  const loadData = (id) => {
    db.collection(SCHEDULES).doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const firebaseData = doc.data()
          setData({ ...firebaseData })
          const totals = {}
          for (const field of menu) {
            totals[field] = { qty: firebaseData[field], price: getAmount(field) }
          }
          setTotals({
            ...totals
          })
          const result = calculateSubTotal(totals)
          setQty(result?.qty)
          setSubTotal(result?.subTotal)
        } else {
          console.log('No such document!')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
  }

  const checkData = (field) => {
    let fieldData = ''
    if (typeof data[field] !== 'undefined') {
      if (field === DATE_ORDER_PLACED) {
        fieldData = formatDate(formatDateFromFirebase(data[field]))
      } else if (field === DATE_START) {
        fieldData = normalizeHour(formatDateFromFirebase(data[field]))
      } else if (field === DATE_END) {
        fieldData = normalizeHour(formatDateFromFirebase(data[field]))
      } else {
        fieldData = data[field]
      }
    }
    return fieldData
  }

  return (
    <Wrapper>
      <Actions>
        <button onClick={props.handleBack} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
          <BiArrowBack size={20} />
        </button>
      </Actions>
      <Container>
        <Panel>
          <Paper>
            <h3>Order Details</h3>
            <div>
              {data && [
                [ORDER_NO, BRANCH],
                [ACCOUNT_NAME, CONTACT_NUMBER],
                [DATE_ORDER_PLACED, ORDER_VIA],
                [DATE_START, DATE_END]].map((fieldName, index) => {
                return (
                    <Body key={index}>
                      <Description>
                        <Label>{LABELS[fieldName[0]]}</Label>
                        <div>{checkData(fieldName[0])}</div>
                      </Description>
                      <Description>
                        <Label2>{LABELS[fieldName[1]]}</Label2>
                        <div>{checkData(fieldName[1])}</div>
                      </Description>
                    </Body>
                )
              })}
            </div>
            <div>
              <table style={{ width: '100%' }}>
                <tr style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', backgroundColor: 'pink', padding: '.5rem .5rem' }}>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                    Menu
                  </th>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                    Qty
                  </th>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                    Price
                  </th>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                    Amount
                  </th>
                </tr>
                {Object.keys(totals).map((total, index) => {
                  return totals[total]?.qty > 0
                    ? (
                      <tr key={index} style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', padding: '.5rem .5rem' }}>
                        <td style={{ flex: '1' }}>
                          {LABELS[total]}
                        </td>
                        <td style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                          {totals[total]?.qty}
                        </td>
                        <td style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                          {totals[total]?.price}
                        </td>
                        <td style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                          {(parseInt(totals[total]?.qty) * parseInt(totals[total]?.price)).toFixed(2)}
                        </td>
                      </tr>
                      )
                    : null
                })}

              </table>
              <table style={{ width: '100%' }}>
                <tr style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', borderTop: '1px solid #eee', padding: '.5rem .5rem' }}>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                    Total
                  </th>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                    {qty}
                  </th>
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }} />
                  <th style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                    {subTotal}
                  </th>
                </tr>
              </table>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </Paper>
        </Panel>
        <Panel>
          <Paper>
            <h3>Payment Details</h3>
            <div>
              <Paymentform id={props?.id} subTotal={subTotal} onBack={props.handleBack} />
              <br />
              <br />
              <br />
            </div>
          </Paper>
        </Panel>
      </Container>
    </Wrapper>
  )
}
