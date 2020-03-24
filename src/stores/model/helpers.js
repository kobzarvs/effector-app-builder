import {keys, omit, path} from 'ramda'


export const sampleDeps = ['source', 'target', 'clock']

export const unitsSortOrder = {
  'root.createModel': 1,
  'root.createModel.createDomain': 2,
  'root.createModel.createEvent': 3,
  'root.createModel.createEffect': 4,
  'root.createModel.createStore': 5,
  'root.createModel.createStoreObject': 6,
  'root.createModel.combine': 7,
  'root.createModel.guard': 7,
  'root.createModel.attach': 7,
  'root.createModel.merge': 7,
  'root.createModel.split': 7,
  'root.createModel.forward': 7,
  'root.createModel.fromObservable': 7,
  'root.createModel.createFunc': 10,
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
