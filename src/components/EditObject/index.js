import React from 'react'
import {Typography} from 'antd'
import {useStore} from 'effector-react'
import {$selectedObject} from '../../stores/model/state'
import {StoreForm} from './StoreForm'


export const EditObject = () => {
  const selectedObject = useStore($selectedObject)

  if (!selectedObject) return null

  console.log(selectedObject)

  return (
    <>
      <div style={{padding: 20}}>
        <Typography.Title level={4}>
          {selectedObject.type.toUpperCase()} PROPERTIES
        </Typography.Title>

        {selectedObject.type === 'store' && (
          <StoreForm key={selectedObject.id} data={selectedObject}/>
        )}
      </div>
    </>
  )
}
