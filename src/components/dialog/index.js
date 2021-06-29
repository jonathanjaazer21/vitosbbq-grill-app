import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import fields from 'components/fields'
import { INPUT } from 'components/fields/types'
import { AiOutlinePlus } from 'react-icons/ai'

export default function App (props) {
  const [fieldNames, setFieldNames] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    props.setOthers(fieldNames)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleAdd = (index) => {
    const newFieldNames = { ...fieldNames }
    newFieldNames[index] = ''
    setFieldNames(newFieldNames)
  }

  const handleChange = (e, index) => {
    const newFieldNames = { ...fieldNames }
    newFieldNames[index] = e.target.value
    setFieldNames(newFieldNames)
  }

  useEffect(() => {
    if (props?.others) {
      let count = 0
      for (const key in props?.others) {
        setFieldNames({ ...fieldNames, [count]: key })
        count = count + 1
      }
    } else {
      setFieldNames({ 0: '' })
    }
  }, [props?.others])

  return (
    <>
      <Button type='primary' onClick={showModal} danger>
        {props.label}
      </Button>
      <Modal
        title='Add fields'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {Object.keys(fieldNames).map((fieldName, index) => {
          return (
            <div key={index} style={{ display: 'flex' }}>
              <div style={{ flex: '.8' }}>
                {fields[INPUT]({
                  name: fieldName,
                  value: fieldNames[index],
                  onChange: (e) => handleChange(e, index)
                })}
              </div>
              <div
                style={{
                  flex: '.2',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}
              >
                {Object.keys(fieldNames).length - 1 === index && (
                  <Button
                    type='secondary'
                    danger
                    shape='circle'
                    onClick={() => handleAdd(index + 1)}
                    icon={<AiOutlinePlus />}
                  />
                )}
              </div>
            </div>
          )
        })}
      </Modal>
    </>
  )
}
