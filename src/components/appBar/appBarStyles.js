import styled from 'styled-components'
import { FaUserAlt } from 'react-icons/fa'

export const User = styled(FaUserAlt)`
  font-size: 1.5rem;
`

export const UserProfile = styled.div`
  padding: '2rem';
  display: '';
  z-index: '999';
  position: 'absolute';
  background-color: 'white';
  right: 0;
  top: 0;
`

export const Wrapper = styled.nav`
  display: flex;
  padding: 0.5rem 1rem;
  background-color: ${props =>
    props.isToggled ? props.theme.primaryColor : props.theme.backgroundColor};
  align-items: center;
  transition: background-color 1s ease-in-out;

  @media (max-width: 768px) {
    background-color: ${props => props.theme.backgroundColor};
  }
`
export const Menu = styled.div`
  display: flex;
  flex: 1;
  margin-left: 1rem;
  margin-top:.7rem;
`

export const Item = styled.p`
  display:flex;
  padding: 0rem 0.5rem;
  color: ${({ isActive, theme, isToggled }) =>
    isActive ? theme.active : theme.whiteText};
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`

export const ItemMobileView = styled.p`
  padding: 0rem 0.5rem;
  color: ${({ theme }) => theme.active};
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`
export const Link = styled.div`
  position: relative;
  padding: 0rem 0.5rem;
  text-decoration: none;
  cursor: pointer;
  color: ${props => props.theme.whiteText};

  &:hover {
    color: ${props => props.theme.active};
  }

  @media (max-width: 768px) {
    &:first-child {
      display: none;
    }
  }
`

export const UserProfileLink = styled.div`
  position: relative;
  padding: 0rem 0.5rem;
  text-decoration: none;
  cursor: pointer;
  color: ${props => props.theme.whiteText};

  &:hover {
    color: ${props => props.theme.active};
  }
`
