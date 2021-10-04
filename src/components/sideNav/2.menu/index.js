import React, { useState, useEffect } from "react"
import {
  Wrapper,
  TitleItem,
  MenuItem,
  MenuText,
  ArrowDown,
  ArrowUp,
  SubItem,
  SubMenuContainer,
} from "./styles"
import { useSelectMenus } from "./menuData"
import { useSelector } from "react-redux"
import { selectSideNav } from "../sideNavSlice"
import { selectMenuSlice } from "./menuSlice"
import { Popover, Menu } from "antd"
import { useHistory } from "react-router-dom"
import { useRef } from "react"
const { SubMenu } = Menu

const menus = {}
function CustomMenu({ isToggled }) {
  let history = useHistory()
  const menuRef = useRef()
  const [menuWidth, setMenuWidth] = useState(0)
  const { menuData } = useSelector(selectMenuSlice)
  const sideNavSlice = useSelector(selectSideNav)
  const [state, setState] = useState(menus)

  for (const obj of menuData) {
    menus[obj.title] = sideNavSlice.selectedMenu.includes(obj.title)
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      const width =
        typeof menuRef?.current?.clientWidth !== "undefined"
          ? menuRef?.current?.clientWidth
          : 0
      setMenuWidth(width)
    })
    setMenuWidth(menuRef?.current?.clientWidth)
  }, [menuRef.current])
  return (
    <Wrapper>
      {menuData.map(({ title, Icon, subMenu, display, path, flex }) => (
        <div
          style={
            title === "Settings"
              ? { position: "absolute", bottom: 1, width: "100%" }
              : {}
          }
        >
          <MenuItem
            key={title}
            style={display ? {} : { display: "none" }}
            ref={menuRef}
          >
            {/* main title */}
            {subMenu.length > 0 ? (
              <TitleItem
                active={sideNavSlice.selectedMenu.includes(title)}
                onClick={() => {
                  setState({ ...state, [title]: !state[title] })
                }}
              >
                {menuWidth === 75 || !isToggled ? (
                  <Popover
                    placement="right"
                    title={title}
                    content={
                      <Menu>
                        {subMenu.map((subItem) => (
                          <Menu.Item
                            onClick={() => {
                              history.push(subItem.path)
                            }}
                            active={sideNavSlice.selectedMenu.includes(
                              subItem.title
                            )}
                          >
                            {subItem.title}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                    trigger="click"
                  >
                    <div>
                      <Icon isToggled={isToggled} />
                    </div>
                  </Popover>
                ) : (
                  <div>
                    <Icon isToggled={isToggled} />
                  </div>
                )}

                <MenuText isToggled={isToggled}>{title}</MenuText>
                {state[title] ? <ArrowUp /> : <ArrowDown />}
              </TitleItem>
            ) : (
              <SubItem isToggled={isToggled} to={path}>
                {title}
              </SubItem>
            )}

            {/* sub items */}
            <SubMenuContainer active={state[title]} isToggled={isToggled}>
              {subMenu.map((subItem) => (
                <SubItem
                  style={subItem.display ? {} : { display: "none" }}
                  to={subItem.path}
                  key={subItem.title}
                  active={sideNavSlice.selectedMenu.includes(subItem.title)}
                >
                  <span style={{ marginLeft: "5rem" }}>{subItem.title}</span>
                </SubItem>
              ))}
            </SubMenuContainer>
          </MenuItem>
        </div>
      ))}
    </Wrapper>
  )
}

export default CustomMenu
