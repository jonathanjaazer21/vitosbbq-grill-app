import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { ComponentToPrint } from './ComponentToPrint'

const Print = props => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  useEffect(() => {
    // console.log('change detected', props)
  }, [props])
  return (
    <div>
      <div style={{ display: 'none' }}>
        <ComponentToPrint component={props.component} ref={componentRef} />
      </div>
      <button onClick={() => {
        handlePrint()
        props.triggeredClicked()
      }}
      >{props.button}
      </button>
    </div>
  )
}

export default Print
