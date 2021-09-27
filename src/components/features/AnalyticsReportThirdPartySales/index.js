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
  Divider,
} from "antd"
import {
  SearchOutlined,
  ArrowLeftOutlined,
  PrinterFilled,
} from "@ant-design/icons"
import useReportDirectSales from "./hook"
import {
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import PrintComponent from "./PrintComponent"
const { RangePicker } = DatePicker
const { Title } = Typography

function ReportThirdPartySales({ back }) {
  const [
    {
      rangeProps,
      searchButtonProps,
      tableProps,
      partialTableProps,
      orderViaSummaryTableProps,
      accountNumberSummaryTableProps,
    },
    listWithPartials,
    listWithPartialsTotal,
  ] = useReportDirectSales()
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
          Date Paid:
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
        <Title level={3}>DAILY SALES THIRD PARTY ORDER</Title>
        <Table
          {...tableProps}
          expandable={{
            expandedRowRender: (record) => {
              const partials =
                record?.partials !== "__"
                  ? record?.partials.map((_data) => {
                      const dateStart = formatDateFromDatabase(_data.date)
                      return {
                        datePayment: formatDateSlash(dateStart),
                        StartTime: "",
                        totalDue: "",
                        dateOrderPlaced: "",
                        partials: "",
                        customer: "",
                        amountPaid: Number(_data?.amount),
                      }
                    })
                  : []
              return (
                <Table
                  {...partialTableProps}
                  dataSource={[...partials]}
                ></Table>
              )
            },
            rowExpandable: (record) => {
              if (typeof record?.partials === "object") {
                if (record?.partials.length > 0) {
                  return true
                } else {
                  return false
                }
              } else {
                return false
              }
            },
          }}
        />
        <br />
        <Title level={3}>SUMMARY OF SALES</Title>
        <Space direction="horizontal" align="baseline">
          <Table {...orderViaSummaryTableProps} />
          <Divider type="vertical" />
          <Table {...accountNumberSummaryTableProps} />
        </Space>
      </Space>

      <PrintComponent
        tableProps={tableProps}
        orderViaSummaryTableProps={orderViaSummaryTableProps}
        accountNumberSummaryTableProps={accountNumberSummaryTableProps}
        listWithPartials={[...listWithPartials]}
        listWithPartialsTotal={listWithPartialsTotal}
      />
    </>
  )
}

export default ReportThirdPartySales
