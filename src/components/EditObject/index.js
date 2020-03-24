import React from 'react'
import {Typography} from 'antd'
import {useStore} from 'effector-react'
import {$selectedObject} from '../../stores/layout/state'
import {StoreForm} from './StoreForm'
import {groupBy, omit, values} from 'ramda'
import {UnitForm} from './UnitForm'
import {$flattenModel} from '../../stores/model/init'
import {Metrics} from './Metrics'
import {effectorModel} from '../../stores/model/effector-model'


export const EditObject = () => {
  const selectedObject = useStore($selectedObject)
  const flattenModel = useStore($flattenModel)

  if (!selectedObject || !flattenModel[selectedObject]) return null
  const item = flattenModel[selectedObject]

  const content = () => {
    switch (item.context) {
      case 'root': {
        const groups = groupBy(item => item.type, values(flattenModel))
        // console.log(groups)
        return <Metrics groups={groups} />
      }

      case 'root.createModel.createStore':
        return <StoreForm key={selectedObject} data={item} />

      case 'root.createModel':
      case 'root.createModel.createEvent':
      case 'root.createModel.createFunc':
      case 'root.createModel.createDomain':
        return <UnitForm key={selectedObject} data={item} />

      default:
        return <pre>{JSON.stringify(omit(['parent', 'tags', 'children'], item), null, 2)}</pre>
    }
  }

  return (
    <>
      <div style={{padding: 20, background: 'rgba(0, 0, 0, .04)', height: '100%'}}>
        <Typography.Title level={4} style={{marginBottom: 30}}>
          {effectorModel[item.context].label.toUpperCase()} PROPERTIES
        </Typography.Title>

        {content()}
      </div>
    </>
  )
}
