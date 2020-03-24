import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'


export const createDomainModel = () => ({

  name: 'createDomain',
  label: 'Create domain',
  type: 'domain',
  module: 'state',
  params: [{name: 'name', key: 'name', type: 'string', required: false}],
  create,
  cmd: [
    {
      name: 'onCreateEvent',
      label: '.onCreateEvent',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'hook', type: 'function', required: true},
      ],
    },

    {
      name: 'onCreateEffect',
      label: '.onCreateEffect',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'hook', type: 'function', required: true},
      ],
    },

    {
      name: 'onCreateStore',
      label: '.onCreateStore',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'hook', type: 'function', required: true},
      ],
    },

    {
      name: 'onCreateDomain',
      label: '.onCreateDomain',
      type: 'subscription',
      module: 'init',
      params: [
        {name: 'hook', type: 'function', required: true},
      ],
    },

    {name: 'createEvent', label: '.createEvent', ref: 'models.createModel.createEventModel'},
    {name: 'createEffect', label: '.createEffect', ref: 'models.createModel.createEffect'},
    {name: 'createStore', label: '.createStore', ref: 'models.createModel.createStore'},
    {name: 'createDomain', label: '.createDomain', ref: 'models.createModel.createDomain'},
    {name: 'event', label: '.event', ref: 'models.createModel.createEvent'},
    {name: 'effect', label: '.effect', ref: 'models.createModel.createEffect'},
    {name: 'store', label: '.store', ref: 'models.createModel.createStore'},
    {name: 'domain', label: '.domain', ref: 'models.createModel.createDomain'},
  ],
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName('newDomain', data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {name},
    type: 'domain',
    children: [],
    parent: parent.id,
    context: 'root.createModel.createDomain',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
