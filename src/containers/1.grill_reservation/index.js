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
import { Grid } from "Restructured/Styles"
import { FilteringPanel } from "Restructured/Components/Features"
import DashboardScheduler from "components/features/DashboardScheduler"

function GrillReservation() {
  const dispatch = useDispatch()
  const [isToggled, setIsToggled] = useState(true)
  const [toggle, setToggle] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(navigateTo([DASHBOARD, GRILL_RESERVATION]))
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
            {/* <ScheduleComponent setLoading={setLoading} /> */}
            <DashboardScheduler />
          </Animate>
        </RightContent>
      </Container>

      <ToggleContainer isToggled={isToggled}>
        <Grid
          columns={2}
          responsive={false}
          customSizes={["375px", "1fr"]}
          height="100%"
          alignItems="center"
        >
          <ToggleBody>
            {/* this isToggled is used to hide print button when the sidenav filter of schedules is toggled left*/}
            <FilteringPanel isToggled={isToggled} />
          </ToggleBody>
          <ToggleButton onClick={() => setIsToggled(!isToggled)}>
            {isToggled ? "Open" : "Close"}
          </ToggleButton>
        </Grid>
      </ToggleContainer>
    </Wrapper>
  )
}

export default GrillReservation
