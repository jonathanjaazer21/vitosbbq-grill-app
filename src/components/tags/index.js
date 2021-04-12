import React, { useEffect, useState } from 'react'
import { Select } from 'antd'

const { Option } = Select

const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

export default function Tags (props) {
  return (
    <>
      <label>{props.label}</label>
      <Select
        mode='multiple'
        allowClear
        style={{ width: '100%' }}
        placeholder='Please select'
        value={props.values}
        onChange={props.onChange}
      >
        {props.dropdowns.map(data => <Option key={data}>{data}</Option>)}
      </Select>
    </>
  )
}
