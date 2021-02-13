import React, { useState } from 'react'
import {
  Wrapper,
  TitleItem,
  MenuItem,
  MenuText,
  ArrowDown,
  ArrowUp,
  SubItem,
  SubMenuContainer
} from './styles'
import menuData from './menuData'
import { useSelector } from 'react-redux'
import { selectSideNav } from '../sideNavSlice'

const menus = {}
function Menu ({ isToggled }) {
  const sideNavSlice = useSelector(selectSideNav)
  const [state, setState] = useState(menus)

  for (const obj of menuData) {
    menus[obj.title] = sideNavSlice.selectedMenu.includes(obj.title)
  }

  return (
    <Wrapper>
      {menuData.map(({ title, Icon, subMenu }) => (
        <MenuItem key={title}>
          {/* main title */}
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

          {/* sub items */}
          <SubMenuContainer active={state[title]} isToggled={isToggled}>
            {subMenu.map(subItem => (
              <SubItem
                to={subItem.path}
                key={subItem.title}
                active={sideNavSlice.selectedMenu.includes(subItem.title)}
              >
                {subItem.title}
              </SubItem>
            ))}
          </SubMenuContainer>
        </MenuItem>
      ))}
    </Wrapper>
  )
}

export default Menu
