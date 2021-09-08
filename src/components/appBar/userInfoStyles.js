import styled from "styled-components"

export const UserInfoContainer = styled.div`
  position: fixed;
  height: 100%;
  background-color: white;
  max-width: 375px;
  box-shadow: 1px 1px 10px solid #999;
  border: 1px solid #999;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10000;
`
