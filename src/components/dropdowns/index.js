import React, { useEffect, useState } from 'react'
import { Container } from 'commonStyles'
import { Header, Body, Footer } from './styles'
import Dropdown from './dropdown'
import { Button, Divider } from 'antd'
import { addData, deleteData, getData } from 'services'
import { Dropdowngroup } from './dropdownGroup'
import { useGetDropdownGroup } from './useDropdownGroup'

export default function Dropdowns({ collectionName, withDropdownGroup }) {
  const [dropdowns, setDropdowns] = useState({})
  const [groupDropdowns, saveGroupDropdowns] = useGetDropdownGroup('orderVia')

  useEffect(() => {
    loadDropdowns()
  }, [collectionName])

  const loadDropdowns = async () => {
    const data = await getData(collectionName)
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
    const docId = await addData({ data, collection: collectionName })
    setDropdowns({ ...dropdowns, [docId]: { ...data } })
  }

  const handleRemove = async (id) => {
    console.log('id', id)
    const result = await deleteData({ id, collection: collectionName })
    if (result === 'success') {
      const dropdownsCopy = { ...dropdowns }
      delete dropdownsCopy[id]
      setDropdowns(dropdownsCopy)
    }
  }
  return (
    <Container>
      <Divider />
      <h3 style={{ padding: '1rem 0 0 0' }}>Dropdowns </h3>
      <Header display>
        <Button type='primary' danger onClick={() => handleAddDropdowns()}>Add</Button>
      </Header>
      <Body>
        {Object.keys(dropdowns).map(data => <Dropdown
          collectionName={collectionName}
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
      <Divider />
      <h3 style={withDropdownGroup ? { padding: '1rem 0 0 0' } : { display: 'none' }}>Dropdown Groups</h3>
      <Header display={withDropdownGroup}>
        <Button type='primary' danger onClick={() => { }}>Add</Button>
      </Header>
      <Footer display={withDropdownGroup}>
        {groupDropdowns.map(groupDropdown => {
          const groups = []
          for (const key in groupDropdown) {
            if (key === '_id' || key === 'name') {
            } else {
              groups.push({
                name: key,
                values: groupDropdown[key]
              })
            }
          }
          return (
            <Dropdowngroup
              key={groupDropdowns.name}
              groupName={groupDropdown.name}
              groups={groups}
            />
          )
        })}

      </Footer>
    </Container>
  )
}
