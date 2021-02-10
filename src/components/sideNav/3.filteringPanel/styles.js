import styled from 'styled-components'

export const Header = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  display: ${props => (props.isToggled ? 'block' : 'none')};

  @media (max-width: 768px) {
    display: none;
  }
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  display: ${props => (props.isToggled ? 'block' : 'none')};

  @media (max-width: 768px) {
    display: none;
  }
`
