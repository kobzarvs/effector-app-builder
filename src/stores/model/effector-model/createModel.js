import {v4 as uuidv4} from 'uuid'
import {DIVIDER, getNewName} from './index'
import {createEventModel} from './createEventModel'
import {createStoreModel} from './createStoreModel'
import {createEffectModel} from './createEffectModel'
import {createDomainModel} from './createDomainModel'
import {createCombineModel} from './createCombineModel'
import {createFunctionModel} from './createFunctionModel'
import {remove} from './index'


export const createModel = () => ({
  name: 'createModel',
  label: 'Create model',
  type: 'model',
  module: 'folder',
  params: [
    {name: 'Model name', key: 'name', type: 'string', required: true},
  ],
  create,
  remove,
  cmd: [
    DIVIDER,

    createEventModel(),
    createStoreModel(),
    createEffectModel(),
    createDomainModel(),
    createCombineModel(),

    {
      name: 'guard',
      label: 'guard',
      type: 'event',
      module: 'init',
    },

    {
      name: 'attach',
      label: 'attach',
      type: 'effect',
      module: 'init',
    },

    {
      name: 'merge',
      label: 'merge',
      type: 'event',
      module: 'init',
    },

    {
      name: 'split',
      label: 'split',
      type: 'keys.cases.trigger',
      module: 'init',
      params: [
        {name: 'trigger', type: 'unit', required: true},
        {name: 'cases', type: 'object', required: true},
      ],
    },

    {
      name: 'forward',
      label: 'forward',
      type: 'subscription',
      module: 'init',
      params: [
        {
          name: 'options', type: 'options', required: true, options: [
            {name: 'from', type: 'units', required: true},
            {name: 'to', type: 'units', required: true},
          ],
        },
      ],
    },

    {
      name: 'fromObservable',
      label: 'fromObservable',
      type: 'event',
      module: 'init',
      params: [
        {name: 'observable', type: 'observable', required: true},
      ],
    },

    {
      name: 'createStoreObject',
      label: 'Create store object',
      type: 'store',
      module: 'state',
      params: [
        {name: 'shape', type: 'shape', required: true},
      ],
    },

    DIVIDER,

    createFunctionModel(),
  ],
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('newModel', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {name},
    type: 'model',
    children: [],
    parent: parent.id,
    context: 'root.createModel',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
