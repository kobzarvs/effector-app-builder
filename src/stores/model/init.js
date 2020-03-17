import {createStore, restore, sample} from 'effector'
import {$model, $selectedObject} from './state'
import {selectObject} from './index'


const flatData = (data, result = {}) => {
  return data.reduce((acc, item) => {
    const {children, ...other} = item

    acc[item.id] = other

    if (children) {
      flatData(children, acc)
    }

    return acc
  }, result)
}

const $flattenModel = $model.map(model => flatData(model))

sample({
  source: $flattenModel,
  clock: selectObject,
  fn: (model, id) => {
    console.log('selected', id)
    return model[id]
  },
  target: $selectedObject
})
