import styled from "styled-components"
export const VerticalAutoScroll = styled.div`
  overflow: auto;
`

export const Grid = styled.div`
  box-sizing: border-box;
  display: ${({ display = true }) => (display ? "grid" : "none")};
  height: ${({ height }) => (height ? height : "0%")};
  align-items: ${({ alignItems }) => (alignItems ? alignItems : "flex-start")};
  grid-template-columns: ${({ columns = 1, customSizes = [] }) =>
    customSizes.length > 0
      ? customSizes.join(" ")
      : "repeat(" + columns + ", 1fr)"};
  padding: ${({ padding }) => (padding ? padding : "0")};
  background-color: ${(props) =>
    props.backgroundColor ? "red" : "transparent"};

  @media (max-width: 30rem) {
    grid-template-columns: ${({
      columns = 1,
      customSizes = [],
      responsive = true,
    }) =>
      responsive
        ? "1fr"
        : customSizes.length > 0
        ? customSizes.join(" ")
        : "repeat(" + columns + ", 1fr)"};
  }
`
