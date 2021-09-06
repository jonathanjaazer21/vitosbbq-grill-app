import styled from "styled-components"

export const Wrapper = styled.div`
  display: grid;
`

export const Container = styled.div`
  width: 100%;
`

export const RightContent = styled.div`
  margin-left: ${(props) => (props.isToggled ? "250px" : "75px")};
  transition: margin 0.5s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 75px;
  }
`

export const FixedSidebar = styled.div`
  width: 100%;
  height: 100%;
  background-color: #eee;
  overflow: hidden;
`
