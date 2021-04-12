import React, { useState, useEffect } from 'react'
import { Card, Avatar, Dropdown, Switch, Button } from 'antd'
import { Wrapper } from './styles'
import Tags from 'components/tags'
import { getData } from 'services'
import { BRANCHES, ROLES } from 'services/collectionNames'

const Edit = ({
  setIsEnabled,
  isEnabled,
  handleDiscard,
  handleSave,
  roleValues,
  branchValues
}) => {
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])
  const [isTouched, setIsTouched] = useState(false)
  const [values, setValues] = useState({ branches: [], roles: [] })

  useEffect(() => {
    loadBranches()
    loadRoles()
    setValues({ branches: branchValues, roles: roleValues })
  }, [])

  const loadBranches = async () => {
    const data = []
    const result = await getData(BRANCHES)
    for (const obj of result) {
      data.push(obj.branchName)
    }
    setBranches(data)
  }

  const loadRoles = async () => {
    const data = []
    const result = await getData(ROLES)
    for (const obj of result) {
      data.push(obj.name)
    }
    setRoles(data)
  }
  return (
    <Card
      style={{ width: 300 }}
    >
      <Wrapper>
        <Tags
          label='Roles'
          values={values.roles}
          dropdowns={roles}
          onChange={(value) => {
            setIsTouched(true)
            setValues({ ...values, roles: value })
          }}
        />
        <Tags
          label='Branches'
          values={values.branches}
          dropdowns={branches}
          setIsTouched={() => setIsTouched(true)}
          onChange={(value) => {
            setIsTouched(true)
            setValues({ ...values, branches: value })
          }}
        />
        <br />
        <br />
        {isTouched && <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%' }}>
          <Button
            danger onClick={() => {
              setIsTouched(false)
              setValues({ branches: branchValues, roles: roleValues })
            }}
          >Discard
          </Button>
          <Button
            danger type='primary' onClick={() => {
              setIsTouched(false)
              handleSave({ ...values })
            }}
          >Save
          </Button>
        </div>}
      </Wrapper>
    </Card>
  )
}

export default Edit
