import { UserOutlined, LockOutlined } from "@ant-design/icons"
import CustomInput from "Components/Commons/CustomInput"
import styled from "styled-components"
import React, { useContext, useEffect, useState } from "react"
import MainButton from "Components/Commons/MainButton"
import useAuthentication from "./hook"
import AuthClass from "Services/Classes/AuthClass"
import AutoSelect from "Components/Commons/AutoSelect"
import VitosLogo from "Images/vitosLogo.png"
import { UnauthorizedContext } from "Error/Unauthorized"
import { Result, Space, Spin } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import CustomTitle from "Components/Commons/CustomTitle"

function Authentication() {
  const {
    data,
    branches = [],
    handleChange,
    onSubmit,
    onSignup,
    enableChangePass,
    handleCancel,
  } = useAuthentication()
  return enableChangePass ? (
    <ConfigSpace>
      <Logo>
        <img src={VitosLogo} style={{ width: "100%" }} />
      </Logo>
      <br />
      <CustomTitle typographyType="text" label="Setup New Password" level={5} />
      <br />
      <Password
        onChange={handleChange}
        value={data[AuthClass.PASSWORD]}
        placeholder="New Password"
      />
      <br />
      <RetypePassword
        onChange={handleChange}
        value={data[AuthClass.RETYPE_PASSWORD]}
      />
      <br />
      <br />
      <Space>
        <Cancel onClick={handleCancel} />
        <LoginButton onClick={onSignup} />
      </Space>
    </ConfigSpace>
  ) : (
    <ConfigSpace>
      <Logo>
        <img src={VitosLogo} style={{ width: "100%" }} />
      </Logo>
      <br />
      <Username onChange={handleChange} value={data[AuthClass.USERNAME]} />
      <br />
      <Password onChange={handleChange} value={data[AuthClass.PASSWORD]} />
      <br />
      <SelectBranch onChange={handleChange} options={branches} data={data} />
      <br />
      <LoginButton onClick={onSubmit} />
    </ConfigSpace>
  )
}

// Custom Components
const ConfigSpace = ({ children }) => {
  const { sm, xs } = useBreakpoint()
  const { isLoading, error } = useContext(UnauthorizedContext)

  const reloadPage = () => {
    window.location.reload(false)
  }
  if (xs) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "23rem",
          padding: "2rem 2rem 2rem 2rem",
        }}
      >
        {isLoading && <Spin size="large" />}
        {error && (
          <Result
            status="500"
            title="500"
            subTitle={error}
            extra={<MainButton label="Reload page" onClick={reloadPage} />}
          />
        )}
        {!isLoading && !error && children}
      </div>
    )
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "23rem",
        padding: "2rem 2rem 2rem 2rem",
        // boxShadow: isLoading || error ? "none" : "0px 1px 1rem #999",
        borderRadius: ".5rem",
        backgroundColor: isLoading || error ? "transparent" : "white",
      }}
    >
      {isLoading && <Spin size="large" />}
      {error && (
        <Result
          status="500"
          title="500"
          subTitle={error}
          extra={<MainButton label="Reload page" onClick={reloadPage} />}
        />
      )}
      {!isLoading && !error && children}
    </div>
  )
}

const Username = (props) => {
  return (
    <CustomInput
      prefix={<UserOutlined />}
      size="large"
      placeholder={AuthClass.LABELS[AuthClass.USERNAME]}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value, AuthClass.USERNAME)}
    />
  )
}

const Password = ({
  placeholder = AuthClass.LABELS[AuthClass.PASSWORD],
  ...rest
}) => {
  return (
    <CustomInput
      prefix={<LockOutlined />}
      size="large"
      placeholder={placeholder}
      type="password"
      value={rest.value}
      onChange={(e) => rest.onChange(e.target.value, AuthClass.PASSWORD)}
    />
  )
}

const RetypePassword = (props) => {
  return (
    <CustomInput
      prefix={<LockOutlined />}
      size="large"
      placeholder={AuthClass.LABELS[AuthClass.RETYPE_PASSWORD]}
      type="password"
      value={props.value}
      onChange={(e) =>
        props.onChange(e.target.value, AuthClass.RETYPE_PASSWORD)
      }
    />
  )
}

const SelectBranch = (props) => {
  return (
    <AutoSelect
      placeholder="Select branch"
      options={[...props.options]}
      value={props.data[AuthClass.BRANCH]}
      onChange={(value) => props.onChange(value, AuthClass.BRANCH)}
      size="large"
      width={"100%"}
    />
  )
}

const Cancel = (props) => {
  return <MainButton label="Cancel" size="large" danger {...props} />
}

const LoginButton = (props) => {
  return <MainButton label="Login" size="large" {...props} />
}

// additional styles

const Logo = styled.div`
  background-color: #333;
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
export default Authentication
