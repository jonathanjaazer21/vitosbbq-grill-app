import React, { useEffect, useRef, useState } from "react"
import { Menu } from "antd"
import { useSelectMenus } from "./hook"
import { useHistory } from "react-router"
import CustomDrawer from "Components/Commons/CustomDrawer"
import { MenuOutlined } from "@ant-design/icons"
const { SubMenu } = Menu

function SidenavMobile() {
  const history = useHistory()
  const { menus, selectedKeys } = useSelectMenus()
  const clickedRef = useRef()
  return (
    <CustomDrawer
      type="text"
      shape="circle"
      title="VITO'S BBQ"
      Icon={<MenuOutlined />}
      placement="left"
      bodyStyle={{ padding: 0 }}
      clickedRef={clickedRef}
    >
      <Menu
        mode="inline"
        theme="light"
        style={{ display: "flex", flexDirection: "column" }}
        selectedKeys={selectedKeys}
      >
        {menus.map((menu) => {
          const subMenu = [...menu.subMenu]
          return (
            <SubMenu
              key={menu.key}
              icon={menu.Icon}
              title={menu.title}
              style={{ display: menu.display ? "block" : "none" }}
              onTitleClick={() => {
                history.push(menu.path)
              }}
            >
              {subMenu.map((sub) => {
                return (
                  <Menu.Item
                    key={sub.key}
                    onClick={() => {
                      history.push(sub.path)
                      clickedRef.current.click()
                    }}
                    style={{ display: menu.display ? "block" : "none" }}
                  >
                    {sub.title}
                  </Menu.Item>
                )
              })}
            </SubMenu>
          )
        })}
      </Menu>
    </CustomDrawer>
  )
}

export default SidenavMobile
