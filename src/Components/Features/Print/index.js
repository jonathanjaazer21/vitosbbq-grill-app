import { Button } from "antd"
import React, { useEffect, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { ComponentToPrint } from "./ComponentToPrint"
import "./print.css"

const Print = (props) => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  useEffect(() => {
    // console.log('change detected', props)
  }, [props])
  return (
    <div>
      <div style={{ display: "none" }}>
        <ComponentToPrint component={props.component} ref={componentRef} />
      </div>
      <Button
        size="large"
        shape="circle"
        style={{ color: "#333" }}
        onClick={() => {
          handlePrint()
        }}
      >
        {props.button}
      </Button>
    </div>
  )
}

export default Print
