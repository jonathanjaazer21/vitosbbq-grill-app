import React from 'react'
import { PuffLoader } from 'react-spinners'
import { Wrapper } from './styles'

function Backdrop () {
  return (
    <Wrapper>
      <PuffLoader size={60} loading />
    </Wrapper>
  )
}

export default Backdrop
