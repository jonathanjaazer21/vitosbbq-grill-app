import React, { useEffect, useState } from "react"
import ScheduleComponent from "components/SchedulerComponent"
import AppBar from "components/appBar"
import { Wrapper, Container, RightContent } from "../styles"
import Sidenav from "components/sideNav"
import Animate, { FadeIn } from "animate-css-styled-components"
import {
  GRILL_RESERVATION,
  DASHBOARD,
} from "components/sideNav/2.menu/menuData"
import { useDispatch } from "react-redux"
import { navigateTo } from "components/sideNav/sideNavSlice"
import Backdrop from "components/backdrop"
import {
  ToggleBody,
  ToggleButton,
  ToggleContainer,
} from "Restructured/Styles/toggleableContainer"
import { Flex, Grid } from "Restructured/Styles"
import { FilteringPanel } from "Restructured/Components/Features"

function Dashboard() {
  const dispatch = useDispatch()
  const [isToggled, setIsToggled] = useState(true)
  const [toggle, setToggle] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(navigateTo([DASHBOARD]))
  }, [])

  return (
    <Wrapper>
      {loading && <Backdrop />}
      <Container>
        <Sidenav
          isToggled={toggle}
          navigateTo={[DASHBOARD, GRILL_RESERVATION]}
        />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.2s"]}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <Grid height="90vh" alignItems="center">
              <Flex justifyContent="center">
                <p style={{ fontSize: "2rem" }}>Welcome to Vitos BBQ</p>
              </Flex>
            </Grid>
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default Dashboard
