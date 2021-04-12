import { isEditable } from '@syncfusion/ej2-grids'
import { Button } from 'antd'
import Tags from 'components/tags'
import React, { useState } from 'react'
import { GroupContainer, StyledDropdown, Chips, Chip, ChipValue, ChipContainer, Footer } from './styles'

export function Dropdowngroup(props) {
  const [values, setValues] = useState(['test'])
  return props.isEditable
    ? (
      <StyledDropdown>
        <label>Name: {props.groupName}</label><br />
        <GroupContainer>
          <Tags
            label={props.groupName}
            values={values}
            dropdowns={['test', 'test2', 'test3']}
            onChange={(value) => {
              setValues({ ...values, roles: value })
            }}
          />
        </GroupContainer>
      </StyledDropdown>
    )
    : (
      <StyledDropdown>
        <label>Name: {props.groupName}</label><br />
        <ChipContainer>
          {props.groups.map(group =>
            <div key={group?.name}>
              <label>{group?.name}</label>
              <Chips>
                {group.values?.map(listValue =>
                  <Chip key={listValue}>
                    <ChipValue>{listValue}</ChipValue>
                  </Chip>)}
              </Chips>
            </div>)}
        </ChipContainer>
        <Footer display={!props.isEditable}>
          <Button
            size='small'
            danger onClick={() => { }}
          >Remove
          </Button>
          <Button
            size='small'
            type='primary'
            danger onClick={() => { }}
          >Edit
          </Button>
        </Footer>
      </StyledDropdown>
    )
}
