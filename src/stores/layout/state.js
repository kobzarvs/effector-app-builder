import {createStore} from 'effector'
import {initialModel} from '../model/state'
import {createLocalStore} from '../effector-addon'


export const $rightSider = createStore(false)
export const $showDeps = createLocalStore('units-filter-deps',true)
export const $selectedObject = createLocalStore('selected-unit', 'root')

let leftSideWidth
try {
  leftSideWidth = JSON.parse(localStorage.getItem('left-sider-width'))
} catch (e) {
  //
}
export const $leftSiderWidth = createStore(leftSideWidth || 500)
export const $leftSidebarMinStatus = createStore(false)

export const $unitsFilter = createLocalStore('units-filter', {
  domain: true,
  event: true,
  effect: true,
  store: true,
  function: true,
  process: true,
  title: '',
})

export const $expandedKeys = createLocalStore('tree-expanded-keys', ['root'])
