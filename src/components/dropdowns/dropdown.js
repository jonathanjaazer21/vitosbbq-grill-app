import fields from 'components/fields'
import Input from 'components/fields/input'
import { StyledDropdown, ChipContainer, Chips, Chip, ChipValue, ChipButton, Footer } from './styles'
import { INPUT } from 'components/fields/types'
import React, { useEffect } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { GrAdd } from 'react-icons/gr'
import { Button } from 'antd'
import { useState } from 'react/cjs/react.development'
import { updateData } from 'services'

export default function Dropdown(props) {
  const [isAddShowing, setIsAddShowing] = useState(true)
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [initialList, setInitialList] = useState([])

  useEffect(() => {
    setName(props.name)
    setInitialList(props.list)
  }, [])
  const handleAddChip = (e) => {
    if (e.target.value.trim() !== '') {
      const addedList = [...list]
      addedList.push(e.target.value)
      setList(addedList)

      const listCopy = [...props.list]
      if (!props?.list.includes(e.target.value)) {
        listCopy.push(e.target.value)
      }
      props.handleChangeList(listCopy)
    }
  }

  const handleRemoveChip = (value) => {
    const listCopy = [...props.list]
    const newListCopy = listCopy.filter(data => data !== value)
    props.handleChangeList(newListCopy)
  }

  const handleClose = (clickedButton) => {
    if (clickedButton === 'discard') {
      // const listCopy = [...props.list]
      // const newListCopy = listCopy.filter(data => !list.includes(data))
      props.handleToggleEdit(false, initialList, name, 'discard')
    } else {
      setName(props.name)
      setInitialList(props.list)
      props.handleToggleEdit(false)
      const data = {
        name: props.name,
        list: props.list
      }
      const collection = 'dropdowns'
      const id = props.id
      updateData({ data, collection, id })
    }
    setList([])
  }
  return (
    <StyledDropdown>
      <div style={props.isEditable ? { width: '100%' } : { display: 'none' }}>
        {fields[INPUT]({ label: 'Name', value: props.name, onChange: (e) => props.handleChange(e), isInline: true })}
      </div>
      <div style={!props.isEditable ? { width: '100%' } : { display: 'none' }}>
        <label>Name: </label>
        {props.name}
      </div>
      <br />
      <ChipContainer>
        <Chips>
          {props?.list.map(listValue =>
            <Chip key={listValue}>
              <ChipValue>{listValue}</ChipValue>
              <ChipButton onHover onClick={() => handleRemoveChip(listValue)} isEditable={props.isEditable}>
                <AiOutlineCloseCircle />
              </ChipButton>
            </Chip>)}

          <div style={!props.isEditable ? { display: 'none' } : {}}>
            {isAddShowing
              ? <Chip onHover>
                <ChipValue onClick={() => setIsAddShowing(false)}>Add</ChipValue>
                <ChipButton isEditable onClick={() => setIsAddShowing(false)}>
                  <GrAdd />
                </ChipButton>
              </Chip>
              : <Input onBlur={(e) => {
                handleAddChip(e)
                setIsAddShowing(true)
              }}
              />}

          </div>
        </Chips>

      </ChipContainer>

      <Footer display={!props.isEditable}>
        <Button
          size='small'
          danger onClick={props.handleRemove}
        >Remove
        </Button>
        <Button
          size='small'
          type='primary'
          danger onClick={() => props.handleToggleEdit(true)}
        >Edit
        </Button>
      </Footer>
      <Footer display={props.isEditable}>
        <Button
          size='small'
          danger
          onClick={() => handleClose('discard')}
        >Discard
        </Button>
        <Button
          disabled={!isAddShowing}
          type='primary'
          size='small'
          danger onClick={() => handleClose()}
        >Save
        </Button>
      </Footer>
    </StyledDropdown>
  )
}
