import { Button } from 'antd'
import { useHandleModal } from 'commonFunctions/useHandleModal'
import React, { useState, useEffect } from 'react'
import { Wrapper } from './styles'
import { useGetUsers } from './useGetUsers'
import UserCard from './userCard'
import Modal from 'antd/lib/modal/Modal'
import fields from 'components/fields'
import Input from 'components/fields/input'
import { INPUT } from 'components/fields/types'

export default function Users(props) {
  const [users, handleSave, handleAdd] = useGetUsers()
  const [isModalVisible, showModal, handleOk, handleCancel] = useHandleModal()
  const [values, setValues] = useState({})

  const handleModalOk = () => {
    handleAdd({ ...values })
    setValues({ name: '', email: '' })
    handleOk()
  }
  return (
    <div>
      <Wrapper>
        <Button type='primary' danger onClick={showModal}>
          Add
        </Button>
        <Modal title={props.name} visible={isModalVisible} onOk={handleModalOk} onCancel={handleCancel}>
          {fields[INPUT]({ onChange: (e) => setValues({ ...values, email: e.target.value }), value: values.email, label: 'Email' })}
          {fields[INPUT]({ onChange: (e) => setValues({ ...values, name: e.target.value }), value: values.name, label: 'Name' })}
        </Modal>
      </Wrapper>
      <Wrapper>
        {Object.keys(users).map(id => {
          const data = { ...users[id] }
          return (
            <UserCard
              key={data._id}
              name={data.name}
              email={data?._id}
              roles={data?.roles}
              photoURL={data?.photoURL}
              branches={[...data?.branches]}
              handleSave={({ roles, branches }) => {
                handleSave(roles, branches, data._id)
              }}
              isEnabled={data?.isEnabled}
            />
          )
        })}
      </Wrapper>
    </div>
  )
}
