import React, { useEffect, useState } from "react"
import { Modal, Button, Input, Divider } from "antd"
import useProductServices from "./useProductServices"
import { addData } from "services"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.login/loginSlice"

const produceStateProperty = (productList) => {
  const list = { invoiceNo: "", deliveryNo: "", purchaseOrderNo: "" }
  for (const obj of productList) {
    for (const obj2 of obj.productList) {
      list[obj2?.code] = "0"
    }
  }
  return list
}
const ReceivingModal = () => {
  const userComponentSlice = useSelector(selectUserSlice)
  const { productList } = useProductServices()
  const [importObj, setImportObj] = useState({})
  const [visible, setVisible] = useState(false)

  const handleSubmit = () => {
    const dataToBeSend = {
      ...importObj,
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
    if (visible === false) {
      setImportObj({ ...produceStateProperty(productList) })
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
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
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
