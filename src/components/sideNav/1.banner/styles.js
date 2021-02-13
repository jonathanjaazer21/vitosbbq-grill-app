import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  padding: ${props => props.theme.menuPadding};
  align-items: center;
  width: 100%;
`

export const Logo = styled.img`
  margin-left: 0.3rem;
  width: 4rem;
  border-radius: 50%;
`
export const CompanyName = styled.div`
  color: ${props => props.theme.secondaryColor};
  font-size: ${props => props.theme.headerSize};
  margin-left: 2rem;
`
