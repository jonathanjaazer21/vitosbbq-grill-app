import React, { useState, useEffect } from "react"
import AppBar from "components/appBar"
import { Wrapper, Container, RightContent } from "../styles"
import Sidenav from "components/sideNav"
import Animate, { FadeIn } from "animate-css-styled-components"
import { useDispatch } from "react-redux"
import { navigateTo } from "components/sideNav/sideNavSlice"
import { DAILY_REPORTS, REPORTS } from "components/sideNav/2.menu/menuData"
import DailyReports from "Restructured/Components/Features/DailyReport"

export default function (props) {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    dispatch(navigateTo([REPORTS, DAILY_REPORTS]))
  }, [])

  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.2s"]}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <DailyReports />
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}
