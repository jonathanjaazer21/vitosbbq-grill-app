import CustomDrawer from "Components/Commons/CustomDrawer"
import React, { useContext } from "react"
import { UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { Space, Tag, Typography } from "antd"
import { UnauthorizedContext } from "Error/Unauthorized"
import MainButton from "Components/Commons/MainButton"
import AuthClass from "Services/Classes/AuthClass"
import { useHistory } from "react-router"
const { Text } = Typography

function UserProfile() {
  const history = useHistory()
  const { user } = useContext(UnauthorizedContext)
  return (
    <CustomDrawer
      type="primary"
      shape="circle"
      Icon={<UserOutlined />}
      Footer={
        <Space style={{ display: "flex", justifyContent: "right" }}>
          <MainButton
            label="Logout"
            Icon={<LogoutOutlined />}
            danger={true}
            onClick={() => {
              AuthClass.logout(history)
            }}
          />
        </Space>
      }
    >
      <Space direction="vertical" size="middle">
        <Tag color="processing">My Info</Tag>
        <Space direction="vertical" size={3}>
          <Text type="secondary">Name</Text>
          <span>{user.name}</span>
        </Space>
        <Space direction="vertical" size={3}>
          <Text type="secondary">Email</Text>
          <span>{user._id}</span>
        </Space>
        <Space direction="vertical" size={3}>
          <Text type="secondary">Branch</Text>
          <span style={{ color: "red", fontWeight: "bold" }}>
            {user.branchSelected}
          </span>
        </Space>
        <br />
        <Tag color="processing">Password Settings</Tag>
        <MainButton label="Change Password" type="default" />
      </Space>
    </CustomDrawer>
  )
}

export default UserProfile
