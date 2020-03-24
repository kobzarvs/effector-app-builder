import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'


export const createEffectModel = () => ({
  name: 'createEffect',
  label: 'Create effect',
  type: 'effect',
  module: 'index',
  params: [
    {name: 'name', type: 'string', required: false},
    {
      name: 'params', type: 'options', required: false, options: [
        {name: 'handler', type: 'function'},
      ],
    },
  ],
  create,
  cmd: [
    {
      name: 'use',
      label: '.use',
      type: 'effect',
      module: 'init',
      params: [
        {name: 'handler', type: 'function', required: true},
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
      name: 'prepend',
      label: '.prepend',
      type: 'event',
      module: 'init',
      params: [
        {name: 'fn', type: 'function'},
      ],
    },

    {
      name: 'doneData',
      label: '.doneData',
      type: 'event',
      module: 'init',
    },

    {
      name: 'failData',
      label: '.failData',
      type: 'event',
      module: 'init',
    },

    {
      name: 'done',
      label: '.done',
      type: 'event',
      module: 'init',
    },

    {
      name: 'fail',
      label: '.fail',
      type: 'event',
      module: 'init',
    },

    {
      name: 'finally',
      label: '.finally',
      type: 'event',
      module: 'init',
    },

    {
      name: 'pending',
      label: '.pending',
      type: 'event',
      module: 'init',
    },

    {
      name: 'inFlight',
      label: '.inFlight',
      type: 'event',
      module: 'init',
    },
  ],
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('effect', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {name, params: {handler: null}},
    type: 'effect',
    children: [],
    parent: parent.id,
    context: 'root.createModel.createEffect',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
