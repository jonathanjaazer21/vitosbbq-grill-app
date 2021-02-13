import React, { useEffect, useState } from 'react'
import ScheduleComponent from 'components/SchedulerComponent'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from '../styles'
import Sidenav from 'components/sideNav'
import Animate, { FadeIn } from 'animate-css-styled-components'
import {
  GRILL_RESERVATION,
  DASHBOARD
} from 'components/sideNav/2.menu/menuData'
import { useDispatch } from 'react-redux'
import { navigateTo } from 'components/sideNav/sideNavSlice'

function GrillReservation () {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    dispatch(navigateTo([DASHBOARD, GRILL_RESERVATION]))
  }, [])
  return (
    <Wrapper>
      <Container>
        <Sidenav
          isToggled={toggle}
          navigateTo={[DASHBOARD, GRILL_RESERVATION]}
        />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={['1s']} delay={['0.2s']}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <ScheduleComponent />
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default GrillReservation
