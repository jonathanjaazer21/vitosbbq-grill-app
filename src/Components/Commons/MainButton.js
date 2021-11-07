import { Button } from "antd"
import React from "react"

function MainButton({
  label = "",
  size = "default",
  shape = "round",
  onClick = () => {},
  type = "primary",
  Icon = <></>,
  danger = false,
}) {
  return (
    <Button
      type={type}
      shape={shape}
      size={size}
      onClick={onClick}
      icon={Icon}
      danger={danger}
    >
      {label}
    </Button>
  )
}

export default MainButton
