import React, { useEffect } from "react"
import CookedChef from "Images/cookedChef.jpg"
import { Avatar, Space, Typography } from "antd"
const { Title } = Typography

function MainPage({ children = <Welcome /> }) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "80vh",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "transparent",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  )
}

const Welcome = () => {
  return (
    <Space direction="vertical" align="center">
      <Avatar
        src={CookedChef}
        shape="circle"
        style={{ width: "15rem", height: "15rem" }}
      />
      <Title level={3}>Welcome to Vito's BBQ</Title>
    </Space>
  )
}

export default MainPage
