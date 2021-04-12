import styled from 'styled-components'

export const Wrapper = styled.div`
  display:column;
  width:100%;
  align-items:center;
  justify-content:center;
`
export const Container = styled.div`
  display:flex;
  width:100%;
  align-items:'center';
  justify-content:flex-start;
  padding:.3rem;
`
export const Item = styled.div`
  display:flex;
  flex:1;
  justify-content: ${props => props.right ? 'flex-end' : 'flex-start'};
`
