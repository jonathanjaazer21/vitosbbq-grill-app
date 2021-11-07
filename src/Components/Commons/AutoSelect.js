import { Select } from "antd"
import React, { useEffect } from "react"
const { Option } = Select

const AutoSelect = React.forwardRef((props, ref) => {
  const {
    placeholder = "",
    onChange = () => {},
    options = [],
    size = "default",
    width = 120,
    value = "",
  } = props
  return (
    <Select
      ref={ref}
      style={{ width: width }}
      size={size}
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      // onFocus={onFocus}
      // onBlur={onBlur}
      // onSearch={onSearch}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((option, index) => (
        <Option value={option} key={index}>
          {option}
        </Option>
      ))}
    </Select>
  )
})

export default AutoSelect
