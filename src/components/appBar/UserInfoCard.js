import { Button, Typography, Tag, Input } from "antd"
import { CloseCircleFilled, LogoutOutlined } from "@ant-design/icons"
import { Card } from "antd"
import React, { useState } from "react"
import { auth, firebase } from "services/firebase"
import { Divider } from "rc-menu"
import { UserInfoContainer } from "./userInfoStyles"

const { Title } = Typography
function UserInfoCard({ close, name, email, branch, logout }) {
  const user = auth.currentUser
  const [credentials, setCredentials] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const [changedPasswordIsClicked, setChangedPasswordIsClicked] =
    useState(false)

  const handleChange = (e, field) => {
    setErrorMessage("")
    setCredentials({ ...credentials, [field]: e.target.value })
  }

  const onPasswordChange = () => {
    if (credentials?.password) {
      reAuthenticate()
        .then((data) => {
          console.log("success", data)
          if (credentials?.newPassword) {
            const { newPassword, reTypePassword } = credentials
            if (newPassword.length < 6) {
              setErrorMessage("New password must be at least 6 characters")
              return
            }

            if (newPassword !== reTypePassword) {
              setErrorMessage("Password mismatch")
              return
            }

            user
              .updatePassword(newPassword)
              .then(() => {
                setCredentials({})
                setChangedPasswordIsClicked(false)
                alert("Password was changed")
              })
              .catch((error) => {
                setErrorMessage("Password update failed")
              })
          } else {
            setErrorMessage("New password is required")
          }
        })
        .catch(({ code, message }) => {
          if (code === "auth/wrong-password") {
            setErrorMessage(message)
          }
        })
    } else {
      setErrorMessage("Password is required")
    }
  }

  const reAuthenticate = async () => {
    console.log(email, credentials.password)
    const cred = firebase.auth.EmailAuthProvider.credential(
      email,
      credentials?.password
    )
    return user.reauthenticateWithCredential(cred)
  }
  return (
    <UserInfoContainer>
      <Card
        title={<Title level={2}>Profile</Title>}
        extra={
          <CloseCircleFilled
            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
            onClick={close}
          />
        }
        style={{ width: "375px", flex: 1 }}
      >
        <Tag color="#108ee9">My Info</Tag>
        <Divider />
        <br />
        <span style={{ color: "#999" }}>Name</span>
        <br />
        <span style={{ fontSize: "16px", fontWeight: "light" }}>{name}</span>
        <br />
        <br />
        <span style={{ color: "#999" }}>Email</span>
        <br />
        <span style={{ fontSize: "16px", fontWeight: "light" }}>{email}</span>
        <br />
        <br />
        <span style={{ color: "#999" }}>Branch</span>
        <br />
        <span style={{ fontSize: "16px", fontWeight: "bold", color: "red" }}>
          {branch}
        </span>
        <br />
        <br />
        <Tag color="#108ee9">Password Settings</Tag>
        <Divider />
        <br />
        {!changedPasswordIsClicked && (
          <Button
            type="button"
            onClick={() => setChangedPasswordIsClicked(true)}
          >
            Change Password
          </Button>
        )}

        {changedPasswordIsClicked && (
          <div>
            <span>Current Password</span>
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => handleChange(e, "password")}
            />
            <br />
            <br />
            <span>New Password</span>
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => handleChange(e, "newPassword")}
            />
            <Input
              placeholder="Re-type password"
              type="password"
              onChange={(e) => handleChange(e, "reTypePassword")}
            />
            {errorMessage && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errorMessage}
              </span>
            )}
            <br />
            <br />
            <Button onClick={onPasswordChange}>Save</Button>
            <Button danger onClick={() => setChangedPasswordIsClicked(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
      <Button
        type="primary"
        size="large"
        danger
        icon={<LogoutOutlined />}
        onClick={logout}
      >
        Logout
      </Button>
    </UserInfoContainer>
  )
}

export default UserInfoCard
