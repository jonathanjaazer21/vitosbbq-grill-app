import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #eee;
`

export const Background = styled.img`
  position: absolute;
  width: 100%;
`
export const GoogleContainer = styled.div`
  z-index: 999;
`

export const CookedChef = styled.img`
  width: 20rem;

  @media (max-width: 320px) {
    width: 16rem;
  }
`
export const VitosLogo = styled.img`
  width: 8rem;
  border-radius: 50%;
  position: absolute;
  margin-top: -5rem;
  margin-left: -4rem;

  @media (max-width: 320px) {
    width: 5rem;
  }
`

export const Description = styled.h4`
  color: #666;
  margin-top: 5rem;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
  background-color: white;
  border: 1px solid #eee;
  width: 425px;
  overflow: hidden;
  box-shadow: 1px 1px 10px #eee;
  position: relative;

  @media (max-width: 425px) {
    width: 100vw;
    height: 100vh;
  }
`
