import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
`
export const Header = styled.div`
  display:flex;
  padding: 2rem;
  width:100%;
  justify-content: flex-start;
  align-items:center;
`
export const HeaderContent = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: flex-start;
  align-items:flex-start;
  width:100%;
  margin-left:2rem;

  h3 {
    margin-left:2rem;
  }
`

export const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  width:100%;
`
export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 0rem;
  width:90vw;
  justify-content: space-between;
`
export const Description = styled.div`
  display:flex;
  padding:.5rem;
  justify-content:flex-start;
`

export const Label = styled.div`
  font-size:14px;
  color: grey;
`
export const Label2 = styled.div`
  font-size:14px;
  display:flex;
  justify-content:flex-end;
  color: grey;
`
