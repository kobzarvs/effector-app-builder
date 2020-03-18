import {createStore, restore, sample} from 'effector'
import {$model, $selectedObject} from './state'
import {selectObject} from './index'
import {attachLogger} from 'effector-logger/attach'


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

export const $flattenModel = $model.map(model => flatData(model))

$flattenModel.watch(state => {
  console.log(state)
})

sample({
  source: $flattenModel,
  clock: selectObject,
  fn: (model, id) => {
    console.log('selected', id)
    return model[id]
  },
  target: $selectedObject
})
