import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import { DATE_PICKER, DROP_DOWN_LIST, INPUT, NUMBER } from 'components/fields/types'
import { ACCOUNT_NUMBER, AMOUNT_PAID, DATE_PAYMENT, MODE_PAYMENT, PAYMENT_LABELS, REF_NO, SOURCE } from './types'
import { Container, Wrapper } from './styles'
import CustomDialog from 'components/dialog'
import { AiOutlineMinus } from 'react-icons/ai'
import { Button } from 'antd'
import { SCHEDULES } from 'services/collectionNames'
import { updateData } from 'services'
import { useSelector } from 'react-redux'
import { selectTableSlice } from 'components/Table/tableSlice'
import { useGetDropdowns } from 'components/PaymentDetails/dropdowns'
import { Uploads } from 'components/uploads'

export function Paymentform(props) {
  const tableSlice = useSelector(selectTableSlice)
  const [others, setOthers] = useState({ 'Senior Citizen': 0 })
  const [formFields, setFormFields] = useState({})
  const [balance, setBalance] = useState(props?.subTotal)
  const dropdowns = useGetDropdowns()

  useEffect(() => {
    setBalance(parseInt(props?.subTotal))
    const newFormFields = {}
    const newOthers = {}
    const { dataList } = tableSlice
    const data = dataList.find(row => row._id === props?.id)
    // this is only for dropdowns
    for (const obj of dropdowns) {
      newFormFields[obj?.name] = typeof data[obj?.name] !== 'undefined' ? data[obj?.name] : ''
    }

    for (const key in data.others) {
      newOthers[key] = data.others[key]
    }
    setOthers(newOthers)
    setFormFields(newFormFields)
    calculateBalance()
  }, [props?.subTotal, props?.id, dropdowns])

  useEffect(() => {
    calculateBalance()
  }, [others, formFields[AMOUNT_PAID]])

  const calculateBalance = () => {
    const amountPaid = formFields[AMOUNT_PAID]
    const paid = isNaN(amountPaid) ? 0 : amountPaid === '' ? 0 : parseInt(amountPaid)
    let newBalance = parseInt(props?.subTotal) - paid
    for (const key in others) {
      const value = others[key]
      const discount = isNaN(value) ? 0 : value === '' ? 0 : parseInt(value)
      newBalance = newBalance - discount
    }
    setBalance(newBalance)
  }

  const handleOthers = (data) => {
    const newOthers = {}
    for (const key in data) {
      newOthers[data[key]] = 0
    }
    setOthers(newOthers)
  }

  const handleChange = (e, fieldName) => {
    setOthers({ ...others, [fieldName]: e.target.value })
  }

  const handleChangeFormFields = (e, fieldName, type) => {
    const value = type === DROP_DOWN_LIST ? e.value : e.target.value
    setFormFields({ ...formFields, [fieldName]: value })
  }

  const handleRemove = (fieldName) => {
    const newOthers = { ...others }
    delete newOthers[fieldName]
    setOthers(newOthers)
  }

  const handleSubmit = () => {
    const d = new Date(formFields[DATE_PAYMENT])
    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) { // d.valueOf() could also work
        alert('Date is invalid')
        // date is not valid
        return
      } else {
        // date is valid
      }
    } else {
      // not a date
    }
    updateData({ data: { ...formFields, [DATE_PAYMENT]: new Date(formFields[DATE_PAYMENT]), others }, collection: SCHEDULES, id: props?.id })
    props.onBack()
  }

  return (
    <>
      <Wrapper>
        {dropdowns.map(customProps => {
          return (
            <Container key={customProps?.name}>
              {fields[customProps?.type]({
                ...customProps,
                // this value is applied only for dropdowns field
                value: formFields[customProps?.name],
                onChange: (e) => handleChangeFormFields(e, customProps?.name, customProps.type)
              })}
            </Container>
          )
        })}
        <Uploads id={props?.id} />
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '1rem 0rem' }}>
          <div style={{ flex: '1' }}>Others</div>
          <div>
            <CustomDialog label='Less' others={others} setOthers={handleOthers} />
          </div>
        </div>

        {Object.keys(others).map((fieldName, index) => {
          return (
            <Container key={index}>
              {fields[NUMBER]({ name: fieldName, label: fieldName, value: others[fieldName], onChange: (e) => handleChange(e, fieldName) })}

              <div style={{ flex: '.2', display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                <Button type='secondary' shape='circle' icon={<AiOutlineMinus onClick={() => handleRemove(fieldName)} />} disabled={fieldName === 'Senior Citizen'} />
              </div>
            </Container>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '1rem 0rem' }}>
          <div style={{ flex: '1' }}>Balance</div>
          <div>{balance.toFixed(2)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='primary' danger onClick={handleSubmit}> Submit</Button>
        </div>
      </Wrapper>
    </>
  )
}