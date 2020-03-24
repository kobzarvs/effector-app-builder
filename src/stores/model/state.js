import {createStore} from 'effector'


export const initialModel = [{
  type: 'root', id: 'root', name: 'models', context: 'root',
  children: [],
}]

export const $model = createStore(initialModel)
export const $savedStatus = createStore(true)
