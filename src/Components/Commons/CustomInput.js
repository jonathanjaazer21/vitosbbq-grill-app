import { Input } from "antd"
import React from "react"
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"

function CustomInput({
  prefix = null,
  placeholder = "",
  size = "default",
  type = "text",
  onChange = () => {},
  ...rest
}) {
  if (type !== "password") {
    if (!prefix) {
      return (
        <Input
          size="default"
          placeholder={placeholder}
          size={size}
          type={type}
          onChange={onChange}
          style={{ width: "100%" }}
          {...rest}
        />
      )
    } else {
      return (
        <Input
          size="default"
          placeholder={placeholder}
          size={size}
          prefix={prefix}
          type={type}
          onChange={onChange}
          style={{ width: "100%" }}
          {...rest}
        />
      )
    }
  } else {
    if (!prefix) {
      return (
        <Input.Password
          size="default"
          placeholder={placeholder}
          size={size}
          type={type}
          onChange={onChange}
          style={{ width: "100%" }}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...rest}
        />
      )
    } else {
      return (
        <Input.Password
          size="default"
          placeholder={placeholder}
          size={size}
          prefix={prefix}
          type={type}
          onChange={onChange}
          style={{ width: "100%" }}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...rest}
        />
      )
    }
  }
}

export default CustomInput
