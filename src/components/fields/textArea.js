import { TextBoxComponent } from "@syncfusion/ej2-react-inputs"
import React, { useEffect, useState } from "react"
import styled from "styled-components"

const OutlinedContainer = styled.div`
  border: 1px solid grey;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: content-box;
  position: relative;
  width: 100%;
`

function TextArea(props) {
  return (
    <OutlinedContainer>
      <textarea
        id={props.name}
        class="e-field e-input"
        name={props.name}
        rows="3"
        cols="50"
        value={props.value}
        style={{ resize: "vertical" }}
      />
    </OutlinedContainer>
  )
}

export default TextArea
