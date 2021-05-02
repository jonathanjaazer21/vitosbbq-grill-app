import { FieldContainer } from "../styles"
import React from "react"
import { Select } from "antd"
const { Option } = Select

function CustomSelect({
  onChange,
  onFocus,
  onBlur,
  value,
  label,
  dataSource = [],
}) {
  return (
    <FieldContainer>
      <label>{label}</label>
      <Select defaultValue={value} onChange={onChange} value={value}>
        {dataSource.map((data) => (
          <Option value={data}>{data}</Option>
        ))}
      </Select>
    </FieldContainer>
  )
}

export default CustomSelect
