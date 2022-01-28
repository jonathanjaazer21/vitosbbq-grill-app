import styled from "styled-components"
export const PanelContainer = styled.div`
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "#eee"};
  padding: 1rem;
  border-radius: 0.5rem;
`

export const PanelChips = styled.span`
  background-color: #333;
  color: white;
  border-radius: 10rem;
  font-size: 0.8rem;
  padding: 0rem 1rem;
  text-align: center;
  margin: 0.1rem;
  overflow: hidden;
`

export const ChipValue = styled.span`
  background-color: #eee;
  color: #111;
  border-radius: 0.5rem;
  position: relative;
  right: -1rem;
  padding: 0.1rem 0.5rem;
  width: 1rem;
`
