import {forward} from 'effector'
import {$model, $savedStatus} from './state'
import {message} from 'antd'
import {modelChanged, shouldRecalcTree} from './index'
import {attachStore} from '../effector-addon'


export const MODEL_KEY = 'eap-model'

export const saveModel = attachStore({
  source: $model,
  handler: async ({params, source}) => {
    params = typeof params === 'string' ? params : MODEL_KEY
    try {
      localStorage.setItem(params, JSON.stringify(source))
    } catch (e) {
      message.error('Model save error!')
      return Promise.resolve(false)
    }
    let resolver
    const promise = new Promise(r => resolver = r)
    setTimeout(() => resolver(true), 250)
    return promise
  },
})

export const loadModel = attachStore({
  source: $model,
  handler: async ({params, source}) => {
    params = typeof params === 'string' ? params : MODEL_KEY
    let loadedModel
    try {
      loadedModel = JSON.parse(localStorage.getItem(params))
    } catch (e) {
      message.error('Model save error!')
    }
    let resolver
    const promise = new Promise(r => resolver = r)
    setTimeout(() => resolver(loadedModel || source), 250)
    return promise
  },
})

forward({
  from: loadModel.doneData,
  to: [$model, shouldRecalcTree],
})

$savedStatus
  .on(loadModel.done, () => true)
  .on(saveModel.pending, (_, pending) => !pending)
  .on(modelChanged, () => false)

loadModel(MODEL_KEY)
