import React, { useEffect, useState } from 'react'
import AppBar from 'components/appBar'
import { Wrapper, Container, RightContent } from '../styles'
import Sidenav from 'components/sideNav'
import Animate, { FadeIn } from 'animate-css-styled-components'
import { useDispatch } from 'react-redux'
import { navigateTo } from 'components/sideNav/sideNavSlice'
import {
  MASTER_DATA,
  BRANCH_MASTERFILE
} from 'components/sideNav/2.menu/menuData'
import Table, { toolbarOptions, editSettings } from 'components/Table'
import { clearTable, setTable, deleteTable } from 'components/Table/tableSlice'
import db from 'services/firebase'
import { BRANCHES } from 'services/collectionNames'

function BranchMasterfile() {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    dispatch(navigateTo([MASTER_DATA, BRANCH_MASTERFILE]))
    const unsubscribe = db.collection(BRANCHES).onSnapshot(function (snapshot) {
      const rows = []
      const headers = [
        {
          field: 'branchName',
          headerText: 'Branch name'
        },
        {
          field: 'branchAddress',
          headerText: 'Branch Address'
        },
        {
          field: 'color',
          headerText: 'Color'
        }
      ]
      for (const obj of snapshot.docChanges()) {
        if (obj.type === 'modified') {
          // const data = obj.doc.data()
        } else if (obj.type === 'added') {
          const data = obj.doc.data()
          rows.push({ ...data, _id: obj.doc.id })
        } else if (obj.type === 'removed') {
          dispatch(deleteTable({ _id: obj.doc.id }))
        } else {
          console.log('nothing', obj.type)
        }
      }
      if (rows.length > 0) {
        dispatch(setTable({ rows, headers }))
      }
    })

    return () => {
      unsubscribe()
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

export default BranchMasterfile
