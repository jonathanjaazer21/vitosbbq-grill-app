import React, { useState } from "react"
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

const menus = {}
function Menu({ isToggled }) {
  const { menuData } = useSelector(selectMenuSlice)
  const sideNavSlice = useSelector(selectSideNav)
  const [state, setState] = useState(menus)

  for (const obj of menuData) {
    menus[obj.title] = sideNavSlice.selectedMenu.includes(obj.title)
  }
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
          <MenuItem key={title} style={display ? {} : { display: "none" }}>
            {/* main title */}
            {subMenu.length > 0 ? (
              <TitleItem
                active={sideNavSlice.selectedMenu.includes(title)}
                onClick={() => setState({ ...state, [title]: !state[title] })}
              >
                <div>
                  <Icon isToggled={isToggled} />
                </div>
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

export default Menu
