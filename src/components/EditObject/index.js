import React from 'react'
import {Typography} from 'antd'
import {useStore} from 'effector-react'
import {$selectedObject} from '../../stores/model/state'
import {StoreForm} from './StoreForm'
import {groupBy, omit, values} from 'ramda'
import {UnitForm} from './UnitForm'
import {$flattenModel} from '../../stores/model/init'
import {Metrics} from './Metrics'
import {effectorModel} from '../../stores/model/effector-model'


export const EditObject = () => {
  const selectedObject = useStore($selectedObject)
  const flattenModel = useStore($flattenModel)

  if (!selectedObject) return null

  const content = () => {
    switch (selectedObject.context) {
      case 'root': {
        const groups = groupBy(item => item.type, values(flattenModel))
        // console.log(groups)
        return <Metrics groups={groups} />
      }

      case 'root.createModel.createStore':
        return <StoreForm key={selectedObject.id} data={selectedObject} />

      case 'root.createModel':
      case 'root.createModel.createEvent':
      case 'root.createModel.createFunc':
      case 'root.createModel.createDomain':
        return <UnitForm key={selectedObject.id} data={selectedObject} />

      default:
        return <pre>{JSON.stringify(omit(['parent', 'tags', 'children'], selectedObject), null, 2)}</pre>
    }
  }

  return (
    <>
      <div style={{padding: 20, background: 'rgba(0, 0, 0, .04)', height: '100%'}}>
        <Typography.Title level={4} style={{marginBottom: 30}}>
          {effectorModel[selectedObject.context].label.toUpperCase()} PROPERTIES
        </Typography.Title>

        {content()}
      </div>
    </>
  )
}
