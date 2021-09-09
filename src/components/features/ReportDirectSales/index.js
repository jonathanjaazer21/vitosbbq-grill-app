import React from "react"
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
  Typography,
} from "antd"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import useReportDirectSales from "./hook"
const { RangePicker } = DatePicker
const { Title } = Typography

function ReportDirectSales({ back }) {
  const [{ rangeProps, searchButtonProps, tableProps }] = useReportDirectSales()
  const style = {
    justifyContent: "space-between",
    width: "100%",
    padding: "1rem",
  }
  return (
    <>
      <Space direction="horizontal" style={style}>
        <Button onClick={back} shape="circle" icon={<ArrowLeftOutlined />} />
        <Space wrap>
          Date Order:
          <RangePicker {...rangeProps} />
          <Button
            {...searchButtonProps}
            danger
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </Space>
      </Space>
      <Space direction="vertical" style={style}>
        <Title level={3} style={{ marginLeft: ".5rem" }}>
          DAILY SALES DIRECT ORDER
        </Title>
        <Table {...tableProps} />
      </Space>
    </>
  )
}

export default ReportDirectSales
