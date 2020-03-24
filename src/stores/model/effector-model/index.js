import {keys, omit, values} from 'ramda'
import {createModel} from './createModel'
import {removeUnit} from '../index'


export const DIVIDER = {name: 'divider', type: 'divider'}
export const getNewName = (base, data) => {
  const dblNames = values(data).reduce((acc, item) => item.name.startsWith(base) ? acc + 1 : acc, 0)
  return `${base}${dblNames + 1}`
}

export const remove = ({item}) => removeUnit({item})

export const effectorTreeModel = [
  {
    id: 'root',
    name: 'models',
    label: 'Models',
    type: 'root',
    module: 'folder',
    cmd: [createModel()],
  },
]

const flattenBy = ({tree, by, parent, result = {}}) => {
  const idList = []
  Array.isArray(tree) && tree.length > 0 && tree.forEach((item, index) => {
    const newItem = omit([by], item)
    newItem.id = item.id || `${parent ? `${parent.id}.` : ''}${item.name}`
    newItem.parent = parent ? parent.id : null
    if (keys(result).includes(newItem.id)) {
      newItem.id = `${newItem.id}_${index}`
    }
    idList.push(newItem.id)
    result[newItem.id] = newItem
    if (!item.label && item.type !== 'divider') throw new Error('Bad label for ' + item.name)
    if (item.hasOwnProperty(by)) {
      newItem.cmd = flattenBy({tree: item[by], by, parent: newItem, result})
    }
  })

  return parent ? idList : result
}

export const effectorModel = flattenBy({tree: effectorTreeModel, by: 'cmd'})
effectorModel['root.createModel'].cmd.unshift('root.createModel')
console.log(effectorModel)
