import React, { useEffect, useState } from "react"
import {
  Modal,
  Button,
  DatePicker,
  Table,
  Space,
  Input,
  Select,
  Card,
  Switch,
  Alert,
} from "antd"
import { SearchOutlined } from "@ant-design/icons"
import useGroupPaymentHook from "./hook"
import GroupPaymentPrint from "./groupPaymentPrint"
const { Option } = Select
const { RangePicker } = DatePicker

const CustomModal = ({ visible, setVisible }) => {
  const [
    {
      rangeProps,
      searchInputProps,
      selectProps,
      searchButtonProps,
      refNoProps,
      datePaymentProps,
      editButtonProps,
      discardButtonProps,
      saveButtonProps,
      switchProps,
      tableProps,
    },
    { filteredData, selectData },
  ] = useGroupPaymentHook()

  console.log("selectData", selectData)
  return (
    <Modal
      title="Group Payments"
      visible={visible}
      width={2000}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            saveButtonProps.onClick()
            setVisible(false)
          }}
          disabled={saveButtonProps.disabled}
          danger
        >
          Save
        </Button>,
      ]}
    >
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Space>
            <Switch {...switchProps} />
            {filteredData.length > 0 && (
              <GroupPaymentPrint filteredData={filteredData} />
            )}
          </Space>
          <Space direction="horizontal" wrap>
            Order Date:
            <RangePicker {...rangeProps} />
            <Input
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
              {...searchInputProps}
              addonAfter={
                <Select {...selectProps}>
                  {selectData.map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              }
            />
            <Button
              {...searchButtonProps}
              danger
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Space>
        </div>
        <div style={{ width: "100%", display: "flex", flexFlow: "row wrap" }}>
          <Card
            style={{ width: "100%", maxWidth: "375px", position: "relative" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {filteredData.length > 0 && (
                <Alert
                  message="Informational Notes"
                  description={
                    discardButtonProps.disabled
                      ? "Step 1: Click Edit button below to show the checkboxes in the table"
                      : "Step 2: Please input the Ref No first before checking the box"
                  }
                  type="info"
                  showIcon
                  closable
                />
              )}
              <label>Ref No</label>
              <Input {...refNoProps} />
              <label>Date Payment</label>
              <DatePicker
                allowClear={false}
                style={{ width: "100%" }}
                format="MM/DD/YYYY"
                {...datePaymentProps}
                onKeyDown={(e) => {
                  e.preventDefault()
                  return false
                }}
              />
            </Space>
            <br />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                width: "100%",
              }}
            >
              <Space>
                <Button {...discardButtonProps}>Discard</Button>
                <Button danger {...editButtonProps}>
                  Edit
                </Button>
              </Space>
            </div>
          </Card>
          {/* <div style={{ overflowY: "auto", flex: 1, minWidth: "375px" }}> */}
          <Table
            {...tableProps}
            style={{ flex: 1, minWidth: "375px" }}
            pagination={{
              size: "small",
              defaultPageSize: 20,
            }}
            size="small"
            // scroll={{ y: 690 }}
          />
          {/* </div> */}
        </div>
      </Space>
    </Modal>
  )
}

const GroupPayments = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} danger>
        Add Group Payment
      </Button>
      {visible && <CustomModal visible={visible} setVisible={setVisible} />}
    </>
  )
}

export default GroupPayments
