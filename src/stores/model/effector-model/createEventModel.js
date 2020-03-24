import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'


export const createEventModel = () => ({
  name: 'createEvent',
  label: 'Create event',
  type: 'event',
  module: 'index',
  params: [
    {name: 'Event name', key: 'name', type: 'string', required: true},
  ],
  create,
  cmd: [
    {
      name: 'watch',
      label: '.watch',
      module: 'init',
      type: 'subscription',
      params: [
        {name: 'watcher', type: 'function', required: true},
      ],
    },

    {
      name: 'map',
      label: '.map',
      type: 'event',
      module: 'init',
      params: [
        {name: 'fn', type: 'function'},
      ],
    },

    {
      name: 'filter',
      label: '.filter',
      type: 'event',
      module: 'init',
      params: [
        {
          name: 'options', type: 'options', required: true, options: [
            {name: 'fn', type: 'function'},
          ],
        },
      ],
    },

    {
      name: 'filterMap',
      label: '.filterMap',
      type: 'event',
      module: 'init',
      params: [
        {name: 'fn', type: 'function'},
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
  ],
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('event', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    type: 'event',
    params: {name},
    children: [],
    parent: parent.id,
    context: 'root.createModel.createEvent',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
