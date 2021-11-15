import { Popconfirm } from "antd"
import React from "react"

function CustomPopConfirm({
  Component,
  componentProps = {},
  title = "Discard Changes?",
  onConfirm = () => {},
  count = 0,
  ...rest
}) {
  return count > 0 ? (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      okText="Yes"
      cancelText="No"
      {...rest}
    >
      {<Component {...componentProps} />}
    </Popconfirm>
  ) : (
    <Component onClick={onConfirm} {...componentProps} />
  )
}

export default CustomPopConfirm
