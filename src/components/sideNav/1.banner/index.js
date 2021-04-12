import React from 'react'
import logo from 'images/vitosLogo.jpg'
import { Wrapper, Logo, CompanyName } from './styles'

function Banner () {
  return (
    <Wrapper>
      <Logo src={logo} />
      <CompanyName>Vito's BBQ</CompanyName>
    </Wrapper>
  )
}

export default Banner
