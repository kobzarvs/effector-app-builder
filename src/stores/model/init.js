import {merge, sample} from 'effector'
import {$model, $selectedObject} from './state'
import {onContextMenuSelected, resetModel, selectObject, submitItem} from './index'
import {keys, path, pathOr} from 'ramda'
import './persistModel'
import {flatData, sampleDeps, unitsSortOrder} from './helpers'
import {effectorModel} from './effector-model'
import {loadModel, saveModel} from './persistModel'


export const $flattenModel = $model.map(model => flatData(model))

$flattenModel
  // .on(onContextMenuSelected, (data, {item, menuId}) => {
  //   // console.log('context', menuId, item, data)
  // })
  .on(submitItem, (state, {id, values}) => {
    state[id].params = pathOr({}, ['params'], state[id])
    keys(values).forEach(key => state[id].params[key] = values[key])
    if (values.name) state[id].name = values.name
  })

sample({
  source: $flattenModel,
  clock: onContextMenuSelected,
  target: selectObject,
  fn: (data, {item, menuId}) => {
    const run = path([menuId, 'run'], effectorModel)
    if (run) {
      const {item: newItem} = run({parent: item, data})
      console.log('newItem', newItem, data)
      return {id: newItem.id}
    }
  },
})

$flattenModel.updates.watch(state => console.log('flattenModel', state))

$model
  .reset(resetModel)
  .on(merge([onContextMenuSelected, submitItem]), (model) => {
    model[0].children.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : 0
    })
    model[0].children.forEach(m => {
      m.children.sort((a, b) => {
        const pa = unitsSortOrder[a.context] || 10
        const pb = unitsSortOrder[b.context] || 10
        return pa - pb
      })
    })
    return [...model]
  })

export const $taggedModel = $flattenModel.map(model => {
  const items = Object.values(model)
  return items.reduce((acc, item) => {
    item.tags = []

    items.forEach((item2, index) => {
      if (item2.id === item.id) return

      const {id, type, title, children, tags, ...props} = item2
      Object.keys(props).forEach(p => {
        if (item2[p] === item.id) {
          item.tags.push({tag: p, index, item: item2})
        }
      })

      switch (item.type) {
        case 'sample':
          sampleDeps.forEach(sd => {
            if (item2.id === item[sd]) {
              item.tags.push({tag: sd, index, item: item2})
            }
          })
          break
        case 'combine':
          if (item.stores.includes(item2.id)) {
            item.tags.push({tag: 'source', index, item: {...item2, parent: item}})
          }
          break
        case 'restore':
          if (item.event === item2.id) {
            item.tags.push({tag: 'event', index, item: item2})
          }
          break
        default:
        //
      }
      // if (item.tags && item.tags.length === 0) delete item.tags

      if (item.tags) {
        // console.log(item.title, item.tags)
      }
    })
    // console.log(item.title, item.tags)
    acc[item.id] = item
    return acc
  }, {})
})

// $taggedModel.watch(console.log)


sample({
  source: $flattenModel,
  clock: selectObject,
  fn: (flattenModel, {id, item}) => {
    console.log('selected', id)
    if (!id && !item && !item.id) return
    return flattenModel[id || item.id]
  },
  target: $selectedObject,
})


window.api = {
  ...window.api,
  model: {
    stores: {
      $model,
      $flattenModel,
      $taggedModel,
      $selectedObject,
    },
    events: {
      selectObject,
      onContextMenuSelected,
      submitItem,
      resetModel,
    },
    effects: {
      loadModel,
      saveModel,
    }
  },
}
