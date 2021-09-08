import React, { useEffect, useState } from "react"
import { Modal, Button, Input, Divider, Select } from "antd"
import useProductServices from "./useProductServices"
import { addData } from "services"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { Option } from "antd/lib/mentions"
import { formatDateDash } from "Restructured/Utilities/dateFormat"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import generatedNoString from "Restructured/Utilities/generatedNoString"

const produceStateProperty = (productList) => {
  const list = { invoiceNo: "", deliveryNo: "", purchaseOrderNo: "" }
  for (const obj of productList) {
    for (const obj2 of obj.productList) {
      list[obj2?.code] = "0"
    }
  }
  return list
}
const ReceivingModal = (props) => {
  const userComponentSlice = useSelector(selectUserSlice)
  const { productList } = useProductServices()
  const [importObj, setImportObj] = useState({})
  const [visible, setVisible] = useState(false)

  const handleSubmit = async () => {
    console.log("imp", importObj)
    const date = formatDateDash(new Date())
    const dateString = date.split("-").join("")
    const verifyGeneratedObj =
      await ReceivingReportServices.getRRByGeneratedNoObj(importObj.branch)
    const _generatedNoString = generatedNoString(verifyGeneratedObj.length)
    const dataToBeSend = {
      ...importObj,
      rrNo: `${importObj.branch.toUpperCase()}-${_generatedNoString}-${dateString}`,
      receivedBy: {
        displayName: userComponentSlice?.displayName,
        email: userComponentSlice?.email,
        roles: userComponentSlice?.roles,
      },
      date: new Date(),
    }
    const result = addData({
      data: dataToBeSend,
      collection: "receivingReports",
      id: null,
    })
    setVisible(false)
  }

  useEffect(() => {
    const date = formatDateDash(new Date())
    const dateString = date.split("-").join("")
    if (visible === false) {
      setImportObj({
        ...produceStateProperty(productList),
        branch: "Libis",
        dateString: dateString,
      })
    }
    if (visible) {
      props.setModalState(true)
    }
  }, [visible, productList])
  return (
    <>
      <Button type="danger" onClick={() => setVisible(true)}>
        Create Receiving Report
      </Button>
      <Modal
        title="Create Receiving Report"
        centered
        visible={visible}
        onOk={() => {
          handleSubmit()
          props.setModalState(false)
        }}
        onCancel={() => {
          setVisible(false)
          props.setModalState(false)
        }}
        width={1000}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexFlow: "row wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              marginBottom: "1rem",
              maxWidth: "15rem",
            }}
          >
            <label>Branch</label>
            <Select
              style={{ width: "13rem" }}
              value={importObj.branch}
              onChange={(value) => {
                console.log("e", value)
                setImportObj({
                  ...importObj,
                  branch: value,
                })
              }}
            >
              <Option value="Libis">Libis</Option>
              <Option value="Ronac">Ronac</Option>
            </Select>
          </div>
          <div
            style={{ padding: "1rem", marginBottom: "1rem", maxWidth: "15rem" }}
          >
            <label>Invoice No</label>
            <Input
              name="invoiceNo"
              onChange={(e) =>
                setImportObj({ ...importObj, invoiceNo: e.target.value })
              }
              value={importObj["invoiceNo"]}
            />
          </div>
          <div
            style={{ padding: "1rem", marginBottom: "1rem", maxWidth: "15rem" }}
          >
            <label>Delivery No</label>
            <Input
              name="deliveryNo"
              onChange={(e) =>
                setImportObj({ ...importObj, deliveryNo: e.target.value })
              }
              value={importObj["deliveryNo"]}
            />
          </div>
          <div
            style={{ padding: "1rem", marginBottom: "1rem", maxWidth: "15rem" }}
          >
            <label>Purchase Order No</label>
            <Input
              name="purchaseOrderNo"
              onChange={(e) =>
                setImportObj({ ...importObj, purchaseOrderNo: e.target.value })
              }
              value={importObj["purchaseOrderNo"]}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {productList.map((product) => {
            return (
              <div>
                <h3>{product?.groupHeader}</h3>
                <Divider />
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  {product?.productList.map((data) => {
                    return (
                      <div
                        style={{
                          padding: "1rem",
                          marginBottom: "1rem",
                          maxWidth: "15rem",
                        }}
                      >
                        <label>{`${data?.description} (${data?.code})`}</label>
                        <Input
                          type="number"
                          name="purchaseOrderNo"
                          onChange={(e) => {
                            setImportObj({
                              ...importObj,
                              [data?.code]: e.target.value,
                            })
                          }}
                          value={importObj[data?.code]}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Modal>
    </>
  )
}

export default ReceivingModal
