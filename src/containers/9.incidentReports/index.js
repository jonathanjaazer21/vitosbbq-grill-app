import React, { useState, useEffect } from "react"
import AppBar from "components/appBar"
import { Wrapper, Container, RightContent } from "../styles"
import Sidenav from "components/sideNav"
import Animate, { FadeIn } from "animate-css-styled-components"
import { useDispatch } from "react-redux"
import { navigateTo } from "components/sideNav/sideNavSlice"
import {
  DIRECT_AND_THIRD_PARTY,
  INCIDENT_REPORTS,
  MASTER_DATA,
  PAYMENT_TRANSACTION,
  REPORTS,
} from "components/sideNav/2.menu/menuData"
import { Products } from "components/products"
import { Reports } from "Restructured/Components/Features"
import DirectAndThirdParty from "Restructured/Components/Features/DirectAndThirdParty"
import IncidentReports from "Restructured/Components/Features/IncidentReports"

export default function (props) {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    dispatch(navigateTo([REPORTS, INCIDENT_REPORTS]))
  }, [])

  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.2s"]}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <IncidentReports />
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}
