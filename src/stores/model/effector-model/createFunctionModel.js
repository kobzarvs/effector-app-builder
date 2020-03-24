import {v4 as uuidv4} from 'uuid'
import {getNewName} from './index'
import {remove} from './index'


export const createFunctionModel = () => ({
  name: 'createFunc',
  label: 'Create function',
  type: 'function',
  module: 'init',
  params: [
    {name: 'Function name', key: 'name', type: 'string', required: true},
    {name: 'Import from', key: 'import', type: 'string', required: false},
    {name: 'Source code', key: 'code', type: 'text', required: false, replace: {name: 'name'}},
  ],
  create,
  remove,
})

const create = ({parent, data}) => {
  const newData = data
  let name = getNewName(`function`, data)
  newData[parent.id].children = newData[parent.id].children || []
  const newItem = {
    id: uuidv4(),
    name,
    params: {filename: '', name, code: '(payload) => {\n  return payload\n}\n'},
    type: `function`,
    parent: parent.id,
    context: 'root.createModel.createFunc',
  }
  newData[parent.id].children.push(newItem)
  return {data: newData, item: newItem}
}
