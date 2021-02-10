import styled from 'styled-components'

import { BsClockHistory } from 'react-icons/bs'
import { RiMarkPenLine } from 'react-icons/ri'
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri'

export const Wrapper = styled.div``

export const Clock = styled(BsClockHistory)`
  margin-left: ${props => (props.isToggled ? '1rem' : '1.3rem')};
  font-size: ${props => (props.isToggled ? '1rem' : '2rem')};
  transition: margin-left 0.5s ease-in-out, font-size 0.5s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 1.3rem;
    font-size: 2rem;
  }
`

export const Pen = styled(RiMarkPenLine)`
  margin-left: ${props => (props.isToggled ? '1rem' : '1.3rem')};
  font-size: ${props => (props.isToggled ? '1rem' : '2rem')};
  transition: margin-left 0.5s ease-in-out, font-size 0.5s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 1.3rem;
    font-size: 2rem;
  }
`

export const ArrowDown = styled(RiArrowDropDownLine)`
  font-size: 1.5rem;
  margin-left: 6rem;
`

export const ArrowUp = styled(RiArrowDropUpLine)`
  font-size: 1.5rem;
  margin-left: 6rem;
`

export const MenuItem = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: ${props => props.theme.menuPadding};
  cursor: pointer;
  color: ${props =>
    props.active ? props.theme.active : props.theme.whiteText};
  background-color: ${props =>
    props.active ? props.theme.hoverColor : 'transparent'};
  border-right: ${props =>
    props.active
      ? `.3rem solid ${props.theme.active}`
      : '.3rem solid transparent'};
  border-radius: ${props => props.theme.borderRadius};
  border-top-right-radius: 1%;
  border-bottom-right-radius: 1%;

  &:hover {
    background-color: ${props => props.theme.hoverColor};
    color: ${props => props.theme.active};
  }
`

export const MenuText = styled.span`
  flex: 0.9;
  margin-left: ${props => (props.isToggled ? '1rem' : '4rem')};
  display: flex;
  align-items: center;
  transition: margin-left 0.5s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 4rem;
  }
`
