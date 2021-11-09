import React from "react"
import { Typography } from "antd"
const { Text, Title } = Typography
function CustomTitle({ typographyType, label = "", children, ...rest }) {
  return typographyType === "text" ? (
    <Text {...rest}>{children ? children : label}</Text>
  ) : (
    <Title {...rest}>{children ? children : label}</Title>
  )
}

export default CustomTitle
