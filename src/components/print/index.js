import {
  ACCOUNT_NAME,
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  DELIVERY_DATE,
  INDICATE_REASON,
  LABELS,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  PARTNER_MERCHANT_ORDER_NO,
  STATUS,
  TIME_SLOT
} from 'components/SchedulerComponent/orderSlip/types'
import Print from './print'
import {
  Container,
  Header,
  Body,
  Footer,
  Description,
  Label,
  Label2,
  HeaderContent
} from './styles'
import cookedChefLogo from 'images/cookedChef.jpg'
import vitosLogo from 'images/vitosLogo.jpg'
import { useState } from 'react'
import { useGetBranches } from 'commonFunctions/useGetBranches'
import formatNumber from 'commonFunctions/formatNumber'

export const formatDate = (date) => {
  if (date) {
    const dateSplit = date.toString().split(' ')
    return `${dateSplit[1]} ${dateSplit[2]}, ${dateSplit[3]} ${dateSplit[0]}`
  } else {
    return date
  }
}

export const normalizeHour = (date) => {
  if (date) {
    const dateSplit = date.toString().split(' ')
    const newDate = `${dateSplit[1]} ${dateSplit[2]}, ${dateSplit[3]}`
    const dateArray = dateSplit[4].split(':')
    if (dateArray[0] > 12) {
      const hour = dateArray[0] - 12
      return `${newDate} ${hour}:${dateArray[1]} PM`
    } else {
      if (parseInt(dateArray[0]) === 12) {
        return `${newDate} ${dateArray[0]}:${dateArray[1]} PM`
      } else {
        return `${newDate} ${dateArray[0]}:${dateArray[1]} AM`
      }
    }
  } else {
    return date
  }
}

const PrintDocument = ({
  orderSlipConfig = [],
  data,
  menu,
  totals,
  qty,
  subTotal,
  productList
}) => {
  const branch = useGetBranches(data[BRANCH])
  const checkData = (field) => {
    let fieldData = ''
    if (field === DATE_ORDER_PLACED) {
      fieldData = formatDate(data[field])
    } else if (field === DATE_START) {
      fieldData = formatDate(data[field])
    } else if (field === DATE_END) {
      fieldData = normalizeHour(data[field])
    } else if (field === TIME_SLOT) {
      if (data[DATE_START] || data[DATE_END]) {
        const start = normalizeHour(data[DATE_START]).split(' ')
        const end = normalizeHour(data[DATE_END]).split(' ')
        fieldData = `${start[3]} ${start[4]} - ${end[3]} ${end[4]}`
      }
    } else if (field === BRANCH) {
      if (data[ORDER_NO]) {
        const splittedOrderNo = data[ORDER_NO].split('-')
        fieldData = `${splittedOrderNo[0]}-${data[field].toUpperCase()} ${
          branch.branchAddress
        }`
      }
    } else if (field === ORDER_VIA) {
      if (data[field]) {
        fieldData = data[field]
      } else {
        fieldData = data[ORDER_VIA_PARTNER]
      }
    } else if (field === PARTNER_MERCHANT_ORDER_NO) {
      return data[ORDER_VIA_PARTNER] ? data[field] : ''
    } else {
      fieldData = data[field]
    }
    return fieldData
  }

  const changedLabel = (field) => {
    if (field === DATE_ORDER_PLACED) {
      return 'Date placed'
    }
    if (field === DATE_START) {
      return 'Delivery Date/Time'
    }
    if (field === PARTNER_MERCHANT_ORDER_NO) {
      return data[ORDER_VIA] ? '' : LABELS[field]
    }
    if (field === ORDER_VIA) {
      return data[ORDER_VIA] ? LABELS[field] : LABELS[ORDER_VIA_PARTNER]
    }
    return LABELS[field]
  }
  return (
    <Container>
      <img
        src={cookedChefLogo}
        height={500}
        style={{ position: 'absolute', zIndex: '-999', opacity: '0.1' }}
      />
      <Header>
        <img src={vitosLogo} height={100} style={{ borderRadius: '50%' }} />
        <HeaderContent>
          <h2 style={{ marginLeft: '1rem' }}>VITO'S BBQ</h2>
          <h2 style={{ marginLeft: '1rem' }}>ORDER FORM</h2>
        </HeaderContent>
      </Header>
      <HeaderContent>
        <h3>ORDER DETAILS</h3>
      </HeaderContent>
      {[
        [ORDER_NO, BRANCH],
        [PARTNER_MERCHANT_ORDER_NO, null],
        [CUSTOMER, DATE_ORDER_PLACED],
        [CONTACT_NUMBER, DATE_START],
        [TIME_SLOT, null],
        [ORDER_VIA, ACCOUNT_NAME]
      ].map((fieldName, index) => {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              width: '90vw',
              justifyContent: 'space-evenly'
            }}
          >
            <Body>
              <Description>
                <Label>{changedLabel(fieldName[0])}: </Label>
                <div style={{ marginLeft: '.5rem' }}>
                  {checkData(fieldName[0])}
                </div>
              </Description>
            </Body>
            <Body>
              <Description>
                <Label>{changedLabel(fieldName[1])}:</Label>
                <div style={{ marginLeft: '.5rem' }}>
                  {checkData(fieldName[1])}
                </div>
              </Description>
            </Body>
          </div>
        )
      })}
      <Footer>
        <table style={{ width: '100%', fontSize: '10px' }}>
          <tr
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              backgroundColor: 'pink',
              padding: '.5rem .5rem'
            }}
          >
            <th
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              Code
            </th>
            <th
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              Product
            </th>
            <th
              style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}
            >
              Price
            </th>
            <th
              style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}
            >
              Qty
            </th>
            <th
              style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}
            >
              Amount
            </th>
          </tr>
          {Object.keys(totals).map((productName, index) => {
            const product = totals[productName]
            const qty = product[0]
            const price = product[1]
            const description = product[2]
            return qty > 0 ? (
              <tr
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                <td style={{ flex: '1' }}>{productName}</td>
                <td style={{ flex: '1' }}>{description}</td>
                <td
                  style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  {formatNumber(price.toFixed(2))}
                </td>
                <td
                  style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  {qty}
                </td>
                <td
                  style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  {formatNumber((parseInt(qty) * parseInt(price)).toFixed(2))}
                </td>
              </tr>
            ) : null
          })}
        </table>
        <table style={{ width: '100%' }}>
          <tr
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              borderTop: '1px solid #eee'
            }}
          >
            <th
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              Total
            </th>
            <th
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            />
            <th
              style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}
            />
            <th
              style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}
            >
              {formatNumber(subTotal.toFixed(2))}
            </th>
          </tr>
        </table>
      </Footer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'pink',
          width: '90vw'
        }}
      >
        <Label>Remarks</Label>
        <div>
          <textarea
            value={data?.remarks}
            style={{ width: '100%', border: 'none', height: '5rem' }}
          />
        </div>
      </div>
    </Container>
  )
}
export default (props) => {
  const [triggeredClicked, setTriggeredClicked] = useState(false)
  // const printDocument = triggeredClicked ? <PrintDocument {...props} /> : <div />
  return (
    <Print
      component={<PrintDocument {...props} />}
      button='Print'
      triggeredClicked={() => setTriggeredClicked(true)}
    />
  )
}
