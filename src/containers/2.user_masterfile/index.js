import React, { useEffect, useState } from 'react'
import ScheduleComponent from 'components/SchedulerComponent'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from '../styles'
import Sidenav from 'components/sideNav'
import Animate, { FadeIn } from 'animate-css-styled-components'
import { useDispatch } from 'react-redux'
import { navigateTo } from 'components/sideNav/sideNavSlice'
import {
  MASTER_DATA,
  USER_MASTERFILE
} from 'components/sideNav/2.menu/menuData'
import Table, { toolbarOptions, editSettings } from 'components/Table'
import { clearTable, setTable } from 'components/Table/tableSlice'

function UserMasterfile () {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    const rows = []
    const headers = [
      {
        field: 'email',
        headerText: 'Email'
      },
      {
        field: 'username',
        headerText: 'Username'
      },
      {
        field: 'role',
        headerText: 'Role'
      },
      {
        field: 'branch',
        headerText: 'Branch'
      }
    ]
    dispatch(navigateTo([MASTER_DATA, USER_MASTERFILE]))
    dispatch(setTable({ headers, rows }))
    return () => {
      dispatch(clearTable())
    }
  }, [])
  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={['1s']} delay={['0.2s']}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />
            <Table toolbar={toolbarOptions} editSettings={editSettings} />
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default UserMasterfile
