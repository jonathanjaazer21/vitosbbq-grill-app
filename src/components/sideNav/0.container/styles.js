import styled from 'styled-components'

export const Sidenav = styled.div`
  position: fixed;
  width: ${props => (props.isToggled ? '320px' : '75px')};
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props =>
    props.isToggled ? props.theme.backgroundColor : props.theme.primaryColor};
  overflow-x: hidden;
  overflow-y: auto;
  transition: width 0.5s ease-in-out, background-color 1s ease-in-out;
  z-index: 999;
  @media (max-width: 768px) {
    width: 75px;
    background-color: ${props => props.theme.primaryColor};
  }
`
export const Header = styled.div`
  width: 100%;
  color: ${props => props.theme.whiteText};
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.menuPadding};
`

export const Footer = styled.div``
