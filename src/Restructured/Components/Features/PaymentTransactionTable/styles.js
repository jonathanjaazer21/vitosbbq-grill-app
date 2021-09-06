import styled from "styled-components"
import { Table } from "antd"
import { Checkbox } from "antd"
const { Group } = Checkbox

export const CheckboxGroup = styled(Group)`
  input[value="CONFIRMED"] ~ .ant-checkbox-inner {
    background-color: lightblue;
    border-color: lightblue;
  }

  input[value="PAID"] ~ .ant-checkbox-inner {
    background-color: yellow;
    border-color: yellow;
  }

  input[value="REVISED / RESCHEDULED"] ~ .ant-checkbox-inner {
    background-color: lightblue;
    border-color: lightblue;
  }

  input[value="CANCELLED"] ~ .ant-checkbox-inner {
    background-color: orange;
    border-color: orange;
  }

  input[value="FULFILLED"] ~ .ant-checkbox-inner {
    background-color: transparent;
    border-color: black;
  }

  input[value="INCIDENTS"] ~ .ant-checkbox-inner {
    background-color: #444;
    border-color: #444;
  }

  input[value="NO STATUS"] ~ .ant-checkbox-inner {
    background-color: transparent;
    border-color: #999;
  }
`

export const VerticalAutoScroll = styled.div`
  overflow: auto;
`

export const StyledTable = styled(Table)`
  tr {
    cursor: pointer;
  }
`
