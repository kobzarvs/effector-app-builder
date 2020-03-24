import {attach, createEffect, merge} from 'effector'
import {$model, $savedStatus} from './state'
import {onContextMenuSelected, submitItem} from './index'
import {message} from 'antd'


export const MODEL_KEY = 'eap-model'

const attachStore = ({source, effect, handler}) => {
  return attach({
    effect: createEffect({handler}),
    source,
    mapParams: (params, source) => ({params, source}),
  })
}

export const saveModel = attachStore({
  source: $model,
  handler: async ({params, source}) => {
    params = typeof params === 'string' ? params : MODEL_KEY
    console.log('save', params)
    try {
      localStorage.setItem(params, JSON.stringify(source))
    } catch (e) {
      message.error('Model save error!')
      return Promise.resolve(false)
    }
    let resolver
    const promise = new Promise(r => resolver = r)
    setTimeout(() => resolver(true), 2000)
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
    setTimeout(() => resolver(loadedModel || source), 2000)
    return promise
  },
})

$model
  .on(loadModel.doneData, (state, data) => data || state)

$savedStatus
  .on(merge([loadModel.done, saveModel.done, loadModel.pending, saveModel.pending]), () => true)
  .on(saveModel.pending, (_, pending) => !pending)
  .on(merge([onContextMenuSelected, submitItem]), () => false)

window.model = $model
loadModel('eap-model')
