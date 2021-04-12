import React, { useEffect, useState } from 'react'
import { Card, Avatar, Dropdown, Switch, Button } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Wrapper } from './styles'
import Tags from 'components/tags'
import { getData, updateData } from 'services'
import { BRANCHES, ROLES, USERS } from 'services/collectionNames'
import Edit from './edit'
const { Meta } = Card

const Settings = ({ setIsEnabled, isEnabled }) => {
  return (
    <Card
      style={{ width: 300 }}
    >
      <Wrapper>
        <label style={{ marginRight: '1rem' }}>Disabled / Enabled </label>
        <Switch checked={isEnabled} onChange={setIsEnabled} />
      </Wrapper>
    </Card>
  )
}

export default function Users (props) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])

  useEffect(() => {
    setIsEnabled(props?.isEnabled)
    setRoles(props?.roles)
    setBranches(props?.branches)
  }, [props])

  const handleSave = (values) => {
    props.handleSave(values)
  }

  const handleEnabled = (state) => {
    const data = {
      isEnabled: state
    }
    updateData({ collection: USERS, data, id: props?.email })
    setIsEnabled(state)
  }
  return (
    <Wrapper>
      <Card
        style={{ width: 300 }}
        actions={[
          <Dropdown
            key='setting' overlay={<Settings
              isEnabled={isEnabled}
              setIsEnabled={() => { handleEnabled(!isEnabled) }}
                                   />} placement='bottomCenter'
          >
            <SettingOutlined />
          </Dropdown>,
          <Dropdown
            key='edit' overlay={
              <Edit
                isEnabled={isEnabled}
                roleValues={roles}
                branchValues={branches}
                handleSave={handleSave}
              />
            } placement='bottomCenter'
          >
            <EditOutlined />
          </Dropdown>,
          <EllipsisOutlined key='ellipsis' />
        ]}
      >
        {!isEnabled && <div style={{
          height: '80%',
          width: '100%',
          background: 'grey',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 999,
          opacity: 0.5,
          display: 'flex',
          color: 'white',
          justifyContent: 'center',
          alignItems: 'center'
        }}
                       >UNAUTHORIZED USER
        </div>}
        <Meta
          avatar={<Avatar src={props.photoURL} />}
          title={props.name}
          description={
            <div>
              <p>{props.email}<br /><small style={{ color: 'red' }}>{roles.join(', ')}</small></p>
            </div>
          }
        />
        <div style={{ height: '4rem' }}>
          <div style={{ display: 'flex', flexFlow: 'row wrap', marginLeft: '3rem' }}>
            {branches.map(data => <div key={data} style={{ backgroundColor: '#444', margin: '.3rem', color: 'white', padding: '0rem 1rem', borderRadius: '10px' }}>{data}</div>)}
          </div>
        </div>
      </Card>
    </Wrapper>
  )
}
