import CustomDrawer from "Components/Commons/CustomDrawer"
import React, { useContext } from "react"
import { UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { Input, message, Space, Tag, Typography } from "antd"
import { UnauthorizedContext } from "Error/Unauthorized"
import MainButton from "Components/Commons/MainButton"
import AuthClass from "Services/Classes/AuthClass"
import { useHistory } from "react-router"
import useUserProfile from "./hook"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"

function UserProfile() {
  const history = useHistory()
  const { user } = useContext(UnauthorizedContext)
  const { enablePasswordChange, setEnablePasswordChange } = useUserProfile()
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
            onClick={async () => {
              const result = await AuthClass.logout()
              console.log("logout: ", result)
              if (result) {
                message.info(result)
                history.push("/")
              }
            }}
          />
        </Space>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Tag color="processing">My Info</Tag>
        <Space direction="vertical" size={3}>
          <CustomTitle typographyType="text" type="secondary">
            Name
          </CustomTitle>
          <span>{user.name}</span>
        </Space>
        <Space direction="vertical" size={3}>
          <CustomTitle typographyType="text" type="secondary">
            Email
          </CustomTitle>
          <span>{user._id}</span>
        </Space>
        <Space direction="vertical" size={3}>
          <CustomTitle typographyType="text" type="secondary">
            Branch
          </CustomTitle>
          <span style={{ color: "red", fontWeight: "bold" }}>
            {user.branchSelected}
          </span>
        </Space>
        <br />
        <Tag color="processing">Password Settings</Tag>
        {!enablePasswordChange ? (
          <MainButton
            label="Change Password"
            type="default"
            onClick={() => setEnablePasswordChange(true)}
          />
        ) : (
          <ChangePasswordForm
            setEnablePasswordChange={setEnablePasswordChange}
          />
        )}
      </Space>
    </CustomDrawer>
  )
}

const ChangePasswordForm = (props) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" type="secondary">
        Current Password
      </CustomTitle>
      <CustomInput placeholder="Current Password" type="password" />
      <CustomTitle typographyType="text" type="secondary">
        New Password
      </CustomTitle>
      <CustomInput placeholder="New Password" type="password" />
      <Input placeholder="Re-type Password" type="password" />
      <Space style={{ display: "flex", justifyContent: "right" }}>
        <MainButton
          label="Cancel"
          danger
          onClick={() => props.setEnablePasswordChange(false)}
        />
        <MainButton label="Save" />
      </Space>
    </Space>
  )
}

export default UserProfile
