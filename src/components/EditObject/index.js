import React from 'react'
import {Typography} from 'antd'
import {useStore} from 'effector-react'
import {$selectedObject} from '../../stores/model/state'
import {StoreForm} from './StoreForm'


export const EditObject = () => {
  const selectedObject = useStore($selectedObject)

  if (!selectedObject) return null

  console.log(selectedObject)

  const content = () => {
    switch(selectedObject.type) {
      case 'store':
        return <StoreForm key={selectedObject.id} data={selectedObject}/>

      default:
        return <pre>{JSON.stringify(selectedObject, null, 2)}</pre>
    }
  }

  return (
    <>
      <div style={{padding: 20}}>
        <Typography.Title level={4}>
          {selectedObject.type.toUpperCase()} PROPERTIES
        </Typography.Title>

        {content()}
      </div>
    </>
  )
}
