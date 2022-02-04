import styled from "styled-components"

export const FloatContainer = styled.div`
  position: fixed;
  padding-top: 3rem;
  bottom: -3rem;
  left: 0;
  z-index: 1000;
  background-color: transparent;
  width: 375px;
  display: flex;
  justify-content: flex-end;
  padding-right: 2rem;
  transition: 0.3s;
  visibility: ${(props) => (props.display ? "hidden" : "visible")};

  &&:hover {
    padding-top: 0;
    bottom: 0;
    padding-bottom: 0.5rem;
  }
`
