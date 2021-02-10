import React, { useState } from 'react'
import ScheduleComponent from 'components/SchedulerComponent'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from './styles'
import Sidenav from 'components/sideNav'

function GrillReservation () {
  const [toggle, setToggle] = useState(true)
  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
          <ScheduleComponent />
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default GrillReservation
