import React, { useState, useEffect } from 'react'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from '../styles'
import Sidenav from 'components/sideNav'
import Animate, { FadeIn } from 'animate-css-styled-components'
import { useDispatch } from 'react-redux'
import { navigateTo } from 'components/sideNav/sideNavSlice'
import {
  MASTER_DATA
} from 'components/sideNav/2.menu/menuData'
import Dropdowns from 'components/dropdowns'

export default function (props) {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    dispatch(navigateTo([MASTER_DATA, props?.breadcrumbs]))
  }, [props?.breadcrumbs])

  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={['1s']} delay={['0.2s']}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <Dropdowns collectionName={props?.collectionName} withDropdownGroup={props.withDropdownGroup} />
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}
