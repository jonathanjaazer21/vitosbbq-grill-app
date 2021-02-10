import React from 'react'
import Banner from '../1.banner'
import Menu from '../2.menu'
import FilteringPanel from '../3.filteringPanel/filteringPanel'
import { Sidenav, Header, Body, Footer } from './styles'

function SideNav ({ isToggled }) {
  return (
    <Sidenav isToggled={isToggled}>
      <Header>
        <Banner />
      </Header>
      <Body>
        <Menu isToggled={isToggled} />
        <br />
        <FilteringPanel isToggled={isToggled} />
      </Body>
      <Footer> </Footer>
    </Sidenav>
  )
}

export default SideNav
