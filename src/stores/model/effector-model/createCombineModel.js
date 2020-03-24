import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'
import {createEventModel} from './createEventModel'
import {createStoreModel} from './createStoreModel'
import {createEffectModel} from './createEffectModel'
import {createDomainModel} from './createDomainModel'


export const createCombineModel = () => ({
  name: 'combine',
  label: 'combine',
  type: 'store',
  module: 'init',
  create,
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('newCombinedStore', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {name},
    type: 'store',
    children: [],
    parent: parent.id,
    context: 'root.createModel',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
