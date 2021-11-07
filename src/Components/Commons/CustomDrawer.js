import { Button, Drawer, Space } from "antd"
import React, { useEffect, useState } from "react"

function CustomDrawer({
  title = "User Profile",
  children,
  shape = "round",
  type = "default",
  Icon = <></>,
  buttonLabel = "",
  size = "large",
  width = "375px",
  Footer = <></>,
  placement = "right",
  bodyStyle = {},
  clickedRef,
}) {
  const [visible, setVisible] = useState(false)
  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      <Button
        ref={clickedRef}
        type={type}
        shape={shape}
        icon={Icon}
        size={size}
        onClick={() => {
          setVisible(!visible)
        }}
      >
        {buttonLabel}
      </Button>
      <Drawer
        title={title}
        placement={placement}
        onClose={onClose}
        visible={visible}
        width={width}
        footer={Footer}
        bodyStyle={bodyStyle}
      >
        {children}
      </Drawer>
    </>
  )
}

export default CustomDrawer
