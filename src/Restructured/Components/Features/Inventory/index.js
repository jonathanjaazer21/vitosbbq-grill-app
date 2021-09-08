import React, { useState } from "react"
import { Tabs, Button } from "antd"
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons"
import ProductCards from "./ProductCards"
import ReceivingModal from "./ProductCards/modal"
import ProductTable from "./ProductTable"
import ProductTableView from "./ProductTableView"
const { TabPane } = Tabs

function Inventory() {
  const [modalState, setModalState] = useState(false)
  const operations = <ReceivingModal setModalState={setModalState} />
  return (
    <div style={{ padding: "1rem" }}>
      <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Products Table View
            </span>
          }
          key="1"
        >
          <ProductTableView />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Products Tile View
            </span>
          }
          key="2"
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
          key="3"
        >
          {modalState === false ? (
            <ProductTable modalState={modalState} />
          ) : (
            <div></div>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Inventory
