import React, { useEffect } from "react"
import { Menu } from "antd"
import { useSelectMenus } from "./hook"
import { useHistory } from "react-router"
const { SubMenu } = Menu

function Sidenav() {
  const history = useHistory()
  const { menus, selectedKeys } = useSelectMenus()
  return (
    <Menu
      mode="inline"
      theme="dark"
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
            onTitleClick={() => history.push(menu.path)}
          >
            {subMenu.map((sub) => {
              return (
                <Menu.Item
                  key={sub.key}
                  onClick={() => {
                    history.push(sub.path)
                  }}
                  style={{ display: sub?.display ? "block" : "none" }}
                >
                  {sub.title}
                </Menu.Item>
              )
            })}
          </SubMenu>
        )
      })}
    </Menu>
  )
}

export default Sidenav
