import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  width:100%;
`

export const Body = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding:1rem;
  width:100%;
`

export const StyledDropdown = styled.div`
  display: flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content: flex-start;
  width:20rem;
  padding:1rem;
  border:1px solid #eee;
  background-color: #eee;
  margin-right: 3px;
  margin-bottom:3px;
  height:15rem;
`
export const ChipContainer = styled.div`
  height:8rem;
  overflow:auto;
`

export const Chips = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`
export const Chip = styled.div`
  display:flex;
  background-color:#999;
  border-radius: 1rem;
  padding: 0 .5rem;
  align-items:center;
  justify-content:center;
  margin-right:3px;
  margin-bottom:3px;
  cursor:pointer;

  &:hover{
    background-color:${props => props.onHover ? '#777' : '#999'};
  }
`

export const ChipValue = styled.div`
  padding-right:.3rem;
`
export const ChipButton = styled.button`
  display:${props => props.isEditable ? 'flex' : 'none'};
  align-items:center;
  outline:none;
  border: none;
  background-color: transparent;
  cursor:pointer;
  border-radius: 50%;
  padding:0px;

  &:hover{
    background-color:${props => props.onHover ? '#777' : 'transparent'};
  }
`

export const Footer = styled.div`
  display:${props => props.display ? 'flex' : 'none'};
  justify-content: flex-end;
  padding:1rem 0rem 0rem;
  width:100%;
`
