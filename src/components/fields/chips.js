import React from 'react'
import {
  ChipListComponent,
  ChipsDirective,
  ChipDirective
} from '@syncfusion/ej2-react-buttons'
function Chips (props) {
  const { chips } = props
  return (
    <ChipListComponent id='chip-avatar'>
      <ChipsDirective>
        {chips.map(({ label, value }) => (
          <ChipDirective key={label} text={`${label}: ${value}`}>
            data
          </ChipDirective>
        ))}
      </ChipsDirective>
    </ChipListComponent>
  )
}

export default Chips
