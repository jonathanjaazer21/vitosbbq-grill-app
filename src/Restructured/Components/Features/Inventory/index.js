import React from "react"
import { Tabs, Button } from "antd"
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons"
import ProductCards from "./ProductCards"
import ReceivingModal from "./ProductCards/modal"
import ProductTable from "./ProductTable"
const { TabPane } = Tabs

function Inventory() {
  const operations = <ReceivingModal />
  return (
    <div style={{ padding: "1rem" }}>
      <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Products
            </span>
          }
          key="1"
        >
          <ProductCards />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Receiving Report
            </span>
          }
          key="2"
        >
          <ProductTable />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Inventory
