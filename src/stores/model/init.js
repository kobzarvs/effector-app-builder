import {sample} from 'effector'
import {$model, $selectedObject} from './state'
import {selectObject} from './index'


const flatData = (data, result = {}, parent) => {
  return data.reduce((acc, item) => {
    const {children, ...other} = item

    acc[item.id] = other
    acc[item.id].parent = parent

    if (children) {
      flatData(children, acc, item)
    }

    return acc
  }, result)
}

export const $flattenModel = $model.map(model => flatData(model))

const sampleDeps = ['source', 'target', 'clock']

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

$taggedModel.watch(console.log)


sample({
  source: $flattenModel,
  clock: selectObject,
  fn: (model, id) => {
    console.log('selected', id)
    return model[id]
  },
  target: $selectedObject,
})
