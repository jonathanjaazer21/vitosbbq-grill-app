import styled from "styled-components"

export const ToggleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 375px;
  height: 100%;
  background-color: #eee;
  box-shadow: ${({ isToggled }) =>
    isToggled ? "none" : "0.1rem 0.1rem 1rem #999"};
  z-index: 1000;
  transition: 0.3s;
  margin-left: ${({ isToggled }) => (isToggled ? "-375px" : "0px")};
`

export const ToggleButton = styled.div`
  background-color: #333;
  color: white;
  padding: 0.3rem 0.5rem 0.3rem 0.3rem;
  border-radius: 0rem 1rem 1rem 0rem;
  cursor: pointer;

  &&:hover {
    background-color: #e51863;
  }
`
export const ToggleBody = styled.div`
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
`
