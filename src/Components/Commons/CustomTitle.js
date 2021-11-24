import React from "react"
import { Typography } from "antd"
const { Text, Title } = Typography
function CustomTitle({
  typographyType,
  label = "",
  ellipsis = true,
  children,
  ...rest
}) {
  return typographyType === "text" ? (
    <Text {...rest} ellipsis={ellipsis}>
      {children ? children : label}
    </Text>
  ) : (
    <Title {...rest} ellipsis={ellipsis}>
      {children ? children : label}
    </Title>
  )
}

export default CustomTitle
