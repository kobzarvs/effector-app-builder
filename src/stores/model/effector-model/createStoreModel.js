import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'


export const createStoreModel = () => ({
  name: 'createStore',
  label: 'Create store',
  type: 'store',
  module: 'state',
  // params: [
  //   {name: 'Store name', key: 'name', type: 'string', required: true},
  //   {name: 'Default state', key: 'defaultState', type: 'object', required: true},
  //   {name: 'is NULL', key: 'defaultState', type: 'boolean', required: false},
  //   {
  //     name: 'Config', key: 'config', type: 'options', required: false, options: [
  //       {name: 'name', key: 'name', type: 'string'},
  //     ],
  //   },
  // ],
  create,
  cmd: [
    {
      name: 'map',
      label: '.map',
      type: 'store',
      module: 'init',
      params: [
        {name: 'fn', type: 'function'},
      ],
    },

    {
      name: 'on',
      label: '.on',
      type: 'store',
      module: 'init',
      params: [
        {name: 'trigger', type: 'unit'},
        {name: 'handler', type: 'function'},
      ],
    },

    {
      name: 'watch',
      label: '.watch',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'watcher', type: 'function', required: true},
      ],
    },

    {
      name: 'watch',
      label: '.watch',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'trigger', type: 'unit', required: true},
        {name: 'watcher', type: 'function', required: true},
      ],
    },

    {
      name: 'reset',
      label: '.reset',
      type: 'store',
      module: 'init',
      params: [
        {name: 'triggers', type: 'units', required: true},
      ],
    },

    {
      name: 'off',
      label: '.off',
      type: 'store',
      module: 'init',
      params: [
        {name: 'trigger', type: 'unit', required: true},
      ],
    },

    {
      name: 'thru',
      label: '.thru',
      type: 'units',
      module: 'init',
      params: [
        {name: 'fn', type: 'function', required: true},
      ],
    },
  ],
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('$store', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {defaultValue: null, config: {name}},
    type: 'store',
    children: [],
    parent: parent.id,
    context: 'root.createModel.createStore',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
