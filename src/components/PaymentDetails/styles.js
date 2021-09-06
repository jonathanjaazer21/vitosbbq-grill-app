import styled from "styled-components"

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Actions = styled.div`
  display: flex;
  background-color: white;
  padding: 1rem;
`
export const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  background-color: white;
  width: 100%;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "none"};
`

export const Panel = styled.div`
  flex: 1;
  padding: 1rem;
`
export const Paper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: solid 1px pink;
  padding: 1rem 1rem;

  && > h3 {
    color: red;
    font-weight: 500;
  }
`

export const Body = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  width: 100%;
`

export const Description = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled.div`
  font-size: 14px;
  color: grey;
`
export const Label2 = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  color: grey;
`
