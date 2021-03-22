import React, { useEffect, useState } from 'react'
import { Container } from 'commonStyles'
import { Header, Body } from './styles'
import Dropdown from './dropdown'
import { Button } from 'antd'
import { addData, deleteData, getData } from 'services'

export default function Dropdowns (props) {
  const [dropdowns, setDropdowns] = useState({})

  useEffect(() => {
    loadDropdowns()
  }, [])

  const loadDropdowns = async () => {
    const data = await getData('dropdowns')
    const dropdownList = {}
    for (const obj of data) {
      dropdownList[obj._id] = { name: obj.name, list: [...obj.list], isEditable: false }
    }
    setDropdowns(dropdownList)
  }

  const handleChange = (e, id) => {
    const dropdownCopy = { ...dropdowns }
    const dropdownObject = { ...dropdownCopy[id] }
    dropdownObject.name = e.target.value
    dropdownCopy[id] = dropdownObject
    setDropdowns(dropdownCopy)
  }

  const handleToggleEdit = (id, status, list = [], name, buttonClicked) => {
    const dropdownCopy = { ...dropdowns }
    const dropdownObject = { ...dropdownCopy[id] }
    dropdownObject.isEditable = status
    if (buttonClicked === 'discard') {
      dropdownObject.name = name
    }
    if (list.length > 0) {
      dropdownObject.list = list
    }
    dropdownCopy[id] = dropdownObject
    setDropdowns(dropdownCopy)
  }

  const handleChangeList = (id, list) => {
    const dropdownCopy = { ...dropdowns }
    const dropdownObject = { ...dropdownCopy[id] }
    dropdownObject.list = [...list]
    dropdownCopy[id] = dropdownObject
    setDropdowns(dropdownCopy)
  }

  const handleAddDropdowns = async () => {
    const data = {
      name: '',
      list: []
    }
    const docId = await addData({ data, collection: 'dropdowns' })
    setDropdowns({ ...dropdowns, [docId]: { ...data } })
  }

  const handleRemove = async (id) => {
    console.log('id', id)
    const result = await deleteData({ id, collection: 'dropdowns' })
    if (result === 'success') {
      const dropdownsCopy = { ...dropdowns }
      delete dropdownsCopy[id]
      setDropdowns(dropdownsCopy)
    }
  }
  return (
    <Container>
      <Header>
        <Button type='primary' danger onClick={() => handleAddDropdowns()}>Add</Button>
      </Header>
      <Body>
        {Object.keys(dropdowns).map(data => <Dropdown
          key={data}
          id={data}
          name={dropdowns[data]?.name}
          list={dropdowns[data]?.list}
          isEditable={dropdowns[data]?.isEditable}
          handleToggleEdit={(status, list, name, buttonClicked) => handleToggleEdit(data, status, list, name, buttonClicked)}
          handleChange={(e) => handleChange(e, data)}
          handleChangeList={(list) => handleChangeList(data, list)}
          handleRemove={() => handleRemove(data)}
                                            />)}
      </Body>
      <div>
        footer
      </div>
    </Container>
  )
}
