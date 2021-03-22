import { BRANCH, CONTACT_NUMBER, CUSTOMER, DATE_END, DATE_ORDER_PLACED, DATE_START, INDICATE_REASON, LABELS, ORDER_NO, ORDER_VIA, STATUS } from 'components/SchedulerComponent/orderSlip/types'
import Print from './print'
import { Container, Header, Body, Footer, Description, Label, Label2 } from './styles'
import cookedChefLogo from 'images/cookedChef.jpg'
import vitosLogo from 'images/vitosLogo.jpg'

export const formatDate = (date) => {
  if (date) {
    const dateSplit = date.toString().split(' ')
    return `${dateSplit[1]} ${dateSplit[2]}, ${dateSplit[3]}`
  } else {
    return date
  }
}

export const normalizeHour = date => {
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

const PrintDocument = ({ orderSlipConfig = [], data, menu, totals, qty, subTotal }) => {
  const checkData = (field) => {
    let fieldData = ''
    if (field === DATE_ORDER_PLACED) {
      fieldData = formatDate(data[field])
    } else if (field === DATE_START) {
      fieldData = normalizeHour(data[field])
    } else if (field === DATE_END) {
      fieldData = normalizeHour(data[field])
    } else {
      fieldData = data[field]
    }
    return fieldData
  }
  return (
    <Container>
      <img src={cookedChefLogo} height={500} style={{ position: 'absolute', zIndex: '-999', opacity: '0.1' }} />
      <Header>
        <img src={vitosLogo} height={100} style={{ borderRadius: '50%' }} />
        <h2 style={{ marginLeft: '1rem' }}>VITO'S GRILL</h2>
      </Header>
      <br />
      {[
        [ORDER_NO, BRANCH],
        [STATUS, INDICATE_REASON],
        [CUSTOMER, CONTACT_NUMBER],
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
      <Footer>
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
      </Footer>
    </Container>
  )
}
export default (props) => {
  return (
    <Print
      component={<PrintDocument {...props} />}
      button='Print'
    />
  )
}
