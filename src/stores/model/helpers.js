import {keys, omit, path} from 'ramda'


export const sampleDeps = ['source', 'target', 'clock']

export const unitsSortOrder = {
  'root.createModel.createDomain': 1,
  'root.createModel.createEvent': 2,
  'root.createModel.createEffect': 3,
  'root.createModel.createStore': 4,
  'root.createModel.createFunc': 5,
}

export const flatData = (data, result = {}, parent) => {
  return data.reduce((acc, item) => {
    acc[item.id] = item
    acc[item.id].parent = path(['id'], parent)

    if (item.children) {
      flatData(item.children, acc, item)
    }

    return acc
  }, result)
}
