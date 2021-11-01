import React, { useEffect, useState } from "react"
import fields from "components/fields"
import Input from "components/fields/input"
import {
  DATE_PICKER,
  DROP_DOWN_LIST,
  INPUT,
  NUMBER,
} from "components/fields/types"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  PAYMENT_LABELS,
  REF_NO,
  SOURCE,
  TOTAL_DUE,
} from "./types"
import { Container, Wrapper } from "./styles"
import CustomDialog from "components/dialog"
import { AiOutlineMinus } from "react-icons/ai"
import { Button } from "antd"
import { SCHEDULES } from "services/collectionNames"
import { updateData, update } from "services"
import { useSelector } from "react-redux"
import { selectTableSlice } from "components/Table/tableSlice"
import { useGetDropdowns } from "components/PaymentDetails/dropdowns"
import { Uploads } from "components/uploads"
import formatNumber from "commonFunctions/formatNumber"
import DiscountAndOthersDialog from "./DiscountAndOthersDialog"
import PartialPayments from "./partialModal"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import FirestoreCommands from "services/firebase/FirestoreCommands"

export function Paymentform(props) {
  const tableSlice = useSelector(selectTableSlice)
  const [others, setOthers] = useState({ "Senior Citizen": 0 })
  const [formFields, setFormFields] = useState({})
  const [orderNo, setOrderNo] = useState("")
  const [balance, setBalance] = useState(props?.subTotal)
  const dropdowns = useGetDropdowns()
  useEffect(() => {
    setBalance(parseInt(props?.subTotal))
    if (props?.id) {
      loadData()
    }
  }, [props?.subTotal, props?.id, dropdowns])

  const loadData = async () => {
    const newFormFields = {}
    const newOthers = {}
    const { dataList } = tableSlice
    // const data = dataList.find((row) => row._id === props?.id)
    const data = await FirestoreCommands.getDataById("schedules", props?.id)
    if (data?.partials) {
      newFormFields.partials = data?.partials.map((partial) => {
        return {
          ...partial,
          date: formatDateFromDatabase(partial.date),
        }
      })
    }
    // this is only for dropdowns
    for (const obj of dropdowns) {
      newFormFields[obj?.name] =
        typeof data[obj?.name] !== "undefined" ? data[obj?.name] : ""
    }

    if (data?.datePayment) {
      const dateFromD = formatDateFromDatabase(data[DATE_PAYMENT])
      newFormFields[DATE_PAYMENT] = new Date(formatDateDash(dateFromD))
    }

    for (const key in data.others) {
      newOthers[key] = data.others[key]
    }

    // to set a default value in the field of amount paid
    if (
      newFormFields[AMOUNT_PAID] === "0" ||
      newFormFields[AMOUNT_PAID] === ""
    ) {
      newFormFields[AMOUNT_PAID] = props.subTotal
    }
    newFormFields[TOTAL_DUE] = props.subTotal
    newFormFields["discountAdditionalDetails"] = {
      ...data["discountAdditionalDetails"],
    }

    setOrderNo(data?.orderNo)
    setOthers(newOthers)
    setFormFields(newFormFields)
    calculateBalance(props.subTotal)
  }
  console.log("formFields", others)
  console.log("subTotal", props.subTotal)
  useEffect(() => {
    calculateBalance(formFields[AMOUNT_PAID], others)
  }, [others, formFields[AMOUNT_PAID]])

  const calculateBalance = (amountPaid = 0, less) => {
    // console.log(props.subTotal)
    // const amountPaid = formFields[AMOUNT_PAID]
    // const paid = isNaN(amountPaid)
    //   ? 0
    //   : amountPaid === ''
    //     ? 0
    //     : parseInt(amountPaid)
    // let newBalance = parseInt(props?.subTotal) - paid
    // for (const key in others) {
    //   const value = others[key]
    //   console.log(key, value)
    //   const discount = isNaN(value) ? 0 : value === '' ? 0 : parseInt(value)
    //   newBalance = newBalance - discount
    // }
    // setBalance(newBalance)
    // let _newBalance = parseInt(props.subTotal) || 0
    // for (const key in others) {
    //   _newBalance = _newBalance - others[key]
    // }
    // _newBalance = _newBalance - parseInt(amountPaid)
    // setBalance(_newBalance)

    let _newBalance = 0
    for (const key in less) {
      _newBalance = Number(less[key])
    }
    const totalBalance =
      Number(props?.subTotal) - Number(amountPaid) - _newBalance
    setBalance(totalBalance)
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

  const handleSubmit = async () => {
    const d = new Date(formFields[DATE_PAYMENT])
    if (Object.prototype.toString.call(d) === "[object Date]") {
      // it is a date
      if (isNaN(d.getTime())) {
        // d.valueOf() could also work
        alert("Date is invalid")
        // date is not valid
        return
      } else {
        // date is valid
      }
    } else {
      // not a date
    }

    const data = {
      ...formFields,
      [DATE_PAYMENT]: new Date(formFields[DATE_PAYMENT]),
      others: { ...others },
    }

    const result = await FirestoreCommands.updateDataById(
      "schedules",
      props?.id,
      data
    )
    props.onBack()
  }

  const handleDiscountAdditionalDetails = (data, discName) => {
    const _formFields = { ...formFields }
    _formFields["discountAdditionalDetails"] = { ...data }
    _formFields.amountPaid = (
      Number(_formFields[TOTAL_DUE]) - Number(data[discName]?.amount)
    ).toFixed(2)
    setFormFields(_formFields)
    setOthers({ [discName]: data[discName]?.amount })
  }

  return (
    <>
      <Wrapper>
        <Container>
          {dropdowns.map((customProps) => {
            return fields[customProps?.type]({
              ...customProps,
              // this value is applied only for dropdowns field
              value: formFields[customProps?.name],
              onChange: (e) => {
                if (customProps?.name === TOTAL_DUE) {
                } else {
                  if (customProps?.name === AMOUNT_PAID) {
                    const { partials = [] } = formFields
                    if (partials.length === 0) {
                      handleChangeFormFields(
                        e,
                        customProps?.name,
                        customProps.type
                      )
                    }
                  } else {
                    handleChangeFormFields(
                      e,
                      customProps?.name,
                      customProps.type
                    )
                  }
                }
              },
            })
          })}
        </Container>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0rem 1rem",
          }}
        >
          <Uploads id={props?.id} />
          <PartialPayments
            formFields={formFields}
            setFormFields={setFormFields}
            dropdowns={dropdowns}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "1rem 0rem",
          }}
        >
          <div style={{ flex: "1" }}>Others</div>
          <div>
            {/* <CustomDialog
              label="Less"
              others={others}
              setOthers={handleOthers}
            /> */}
            <DiscountAndOthersDialog
              totalDue={formFields[TOTAL_DUE]}
              setDiscountAdditionalDetails={handleDiscountAdditionalDetails}
              formFields={formFields}
              others={others}
              orderNo={orderNo}
            />
          </div>
        </div>

        {Object.keys(others).map((fieldName, index) => {
          return (
            <Container key={index}>
              {fields[NUMBER]({
                name: fieldName,
                label: fieldName,
                value: others[fieldName],
                // onChange: (e) => handleChange(e, fieldName),
              })}

              <div
                style={{
                  flex: ".2",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Button
                  type="secondary"
                  shape="circle"
                  icon={
                    <AiOutlineMinus onClick={() => handleRemove(fieldName)} />
                  }
                  // disabled={fieldName === "Amount Paid"}
                />
              </div>
            </Container>
          )
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "1rem 0rem",
          }}
        >
          <div style={{ flex: "1" }}>Balance</div>
          <div>{formatNumber(balance.toFixed(2))}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" danger onClick={handleSubmit}>
            {" "}
            Submit
          </Button>
        </div>
      </Wrapper>
    </>
  )
}
