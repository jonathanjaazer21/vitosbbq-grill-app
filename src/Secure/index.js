import React, { useState } from "react"
import { Layout, Grid } from "antd"
import Sidenav from "Components/Features/Sidenav"
import ContentNavigator from "Components/Features/ContentNavigator"
import Unavailable from "Error/Unavailable"
import Title from "antd/lib/typography/Title"
import Predefined from "./Routes/Predefined"
const { Sider } = Layout
const { useBreakpoint } = Grid

function SecuredRoutes() {
  const screens = useBreakpoint()
  const [collapse, setCollapse] = useState(false)
  const onCollapse = (collapsed) => {
    setCollapse(collapsed)
  }

  const { sm } = screens
  return (
    <Layout theme="light">
      {sm && (
        <Sider
          theme="dark"
          collapsible
          collapsed={collapse}
          onCollapse={onCollapse}
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
          }}
        >
          <LogoBanner collapse={collapse} />
          <Sidenav />
        </Sider>
      )}
      <ContentNavigator>
        <Unavailable>
          <Predefined />
        </Unavailable>
      </ContentNavigator>
    </Layout>
  )
}

function LogoBanner({ collapse }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        color: "white",
      }}
    >
      <Title level={4} style={{ color: "white" }}>
        {!collapse ? "VITO'S BBQ" : "V"}
      </Title>
    </div>
  )
}
export default SecuredRoutes
