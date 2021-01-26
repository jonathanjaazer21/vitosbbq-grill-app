import React, { useEffect, useState } from 'react'
import {
  ChipListComponent,
  ChipsDirective,
  ChipDirective
} from '@syncfusion/ej2-react-buttons'
function Chips (props) {
  const [chips, setChips] = useState([])
  useEffect(() => {
    setChips([...props.chips])
  }, [props])
  console.log('chips', chips)
  return (
    <ChipListComponent id='chip-avatar'>
      <ChipsDirective>
        {chips.map(chip => (
          <ChipDirective key={chip.label} text={chip.value} />
        ))}
      </ChipsDirective>
    </ChipListComponent>
  )
}

export default Chips
