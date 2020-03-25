//@flow
import {forward, sample} from 'effector'
import {message} from 'antd'
import {$model} from './state'
import {
  modelChanged,
  newUnitCreated,
  onContextMenuSelected,
  removeUnit,
  resetModel,
  shouldRecalcTree,
  submitItem,
} from './index'
import {keys, path, pathOr} from 'ramda'
import {flatData, unitsSortOrder} from './helpers'
import {effectorModel} from './effector-model'


export const $flattenModel = $model.map(model => flatData(model))

$flattenModel
  .on(newUnitCreated, (data, newItem) => {
    return {...data, [newItem.id]: newItem}
  })
  .on(submitItem, (state, {id, values}) => {
    state[id].params = pathOr({}, ['params'], state[id])
    keys(values).forEach(key => state[id].params[key] = values[key])
    if (values.name) state[id].name = values.name
  })
  .on(removeUnit, (data, {item}) => {
    console.log('.on remove item', item)
    if (!item.parent) {
      message.warning(`Can't remove root unit!`)
      return
    }
    const parent = data[item.parent]
    parent.children = parent.children.filter(unit => unit.id !== item.id)
    return {...data}
  })

sample({
  source: $flattenModel,
  clock: onContextMenuSelected,
  target: newUnitCreated,
  fn: (data, {item, menuId}) => {
    const command = path([menuId, menuId], effectorModel)
    if (command) {
      const {item: newItem} = command({parent: item, data})
      return newItem
    }
  },
})

$flattenModel.updates.watch(state => console.log('flattenModel', state))

forward({
  from: modelChanged,
  to: shouldRecalcTree,
})


$model
  .reset(resetModel)
  .on(shouldRecalcTree, (model) => {
    console.log('* RESORT *')
    model[0].children.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : 0
    })
    model[0].children.forEach(m => {
      m.children.sort((a, b) => {
        const pa = unitsSortOrder[a.context] || 100
        const pb = unitsSortOrder[b.context] || 100
        return pa - pb
      })
    })
    return [...model]
  })

// export const $taggedModel = $flattenModel.map(model => {
//   const items = Object.values(model)
//   return items.reduce((acc, item) => {
//     item.tags = []
//
//     items.forEach((item2, index) => {
//       if (item2.id === item.id) return
//
//       const {id, type, title, children, tags, ...props} = item2
//       Object.keys(props).forEach(p => {
//         if (item2[p] === item.id) {
//           item.tags.push({tag: p, index, item: item2})
//         }
//       })
//
//       switch (item.type) {
//         case 'sample':
//           sampleDeps.forEach(sd => {
//             if (item2.id === item[sd]) {
//               item.tags.push({tag: sd, index, item: item2})
//             }
//           })
//           break
//         case 'combine':
//           if (item.stores.includes(item2.id)) {
//             item.tags.push({tag: 'source', index, item: {...item2, parent: item}})
//           }
//           break
//         case 'restore':
//           if (item.event === item2.id) {
//             item.tags.push({tag: 'event', index, item: item2})
//           }
//           break
//         default:
//         //
//       }
//       // if (item.tags && item.tags.length === 0) delete item.tags
//
//       if (item.tags) {
//         // console.log(item.title, item.tags)
//       }
//     })
//     // console.log(item.title, item.tags)
//     acc[item.id] = item
//     return acc
//   }, {})
// })

// $taggedModel.watch(console.log)
