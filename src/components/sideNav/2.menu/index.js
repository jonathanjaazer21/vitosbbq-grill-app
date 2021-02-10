import React, { useState } from 'react'
import {
  Wrapper,
  MenuItem,
  MenuText,
  Pen,
  Clock,
  ArrowDown,
  ArrowUp
} from './styles'

const menus = {
  Dashboard: false,
  Masterdata: false
}
function Menu ({ isToggled }) {
  const [state, setState] = useState({
    Dashboard: true,
    Masterdata: false
  })

  return (
    <Wrapper>
      {['Dashboard', 'Masterdata'].map(label => (
        <MenuItem
          key={label}
          active={state[label]}
          onClick={() => setState({ ...menus, [label]: true })}
        >
          <div>
            {label === 'Dashboard' ? (
              <Clock isToggled={isToggled} />
            ) : (
              <Pen isToggled={isToggled} />
            )}
          </div>

          <MenuText isToggled={isToggled}>{label}</MenuText>
          {state[label] ? <ArrowUp /> : <ArrowDown />}
        </MenuItem>
      ))}
    </Wrapper>
  )
}

export default Menu
