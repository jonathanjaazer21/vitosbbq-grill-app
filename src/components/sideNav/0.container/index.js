import React from "react"
import { useSelector } from "react-redux"
import Banner from "../1.banner"
import Menu from "../2.menu"
import { GRILL_RESERVATION } from "../2.menu/menuData"
// import FilteringPanel from "../3.filteringPanel/filteringPanel"
import { FilteringPanel } from "Restructured/Components/Features"
import { Grid } from "Restructured/Styles"
import { selectSideNav } from "../sideNavSlice"
import { Sidenav, Header, Body, Footer } from "./styles"

function SideNav({ isToggled }) {
  const { selectedMenu } = useSelector(selectSideNav)
  return (
    <Sidenav isToggled={isToggled}>
      <Header>
        <Banner />
      </Header>
      <Body>
        <Menu isToggled={isToggled} />
        {/* <br /> */}
        {/* {selectedMenu[1] === GRILL_RESERVATION && (
          <Grid display={isToggled} padding="0.5rem">
            <FilteringPanel />
          </Grid>
        )} */}
      </Body>
      <Footer> </Footer>
    </Sidenav>
  )
}

export default SideNav
