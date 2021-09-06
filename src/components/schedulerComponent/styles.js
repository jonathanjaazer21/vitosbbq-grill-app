import styled from "styled-components"

export const CustomButton = styled.button`
  background-color: ${(props) => props.backgroundColor || "white"};
  border: none;
  cursor: pointer;
`
