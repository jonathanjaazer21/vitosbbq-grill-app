import { Dropdown, Menu, Button } from "antd"
import { UserOutlined, DownOutlined } from "@ant-design/icons"
import React from "react"
import MainButton from "Components/Commons/MainButton"

function DropdownChannel({ history, path }) {
  const handleButtonClick = (e) => {}

  const handleMenuClick = (e) => {}

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="1"
        onClick={() => history.push(`${path}/add?channelOption=direct`)}
      >
        Direct
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          history.push(`${path}/add?channelOption=partnerMerchant`)
        }
      >
        Partner Merchant
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => history.push(`${path}/add?channelOption=website`)}
      >
        Website
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <Button shape="round" type="primary">
        Add Order <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default DropdownChannel
