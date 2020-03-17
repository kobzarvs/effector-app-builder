import React from 'react'
import styled from '@xstyled/styled-components'


const FullCenteredPage = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

export const CenterLayout = ({children}) => (
  <FullCenteredPage>
    {children}
  </FullCenteredPage>
)
