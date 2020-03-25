// @flow

import {createStore} from 'effector'
import {createLocalStore} from '../effector-addon'


export const $rightSider = createStore<boolean>(false)
export const $showDeps = createLocalStore<boolean>('units-filter-deps', true)
export const $selectedObject = createLocalStore<string>('selected-unit', 'root')

const DEFAULT_LEFT_SIDE_WIDTH: number = 500
let leftSideWidth: number = DEFAULT_LEFT_SIDE_WIDTH
try {
  const result: ?string = localStorage.getItem('left-sider-width')
  leftSideWidth = result !== undefined && result !== null ? JSON.parse(result) : DEFAULT_LEFT_SIDE_WIDTH
} catch (e) {
  //
}
export const $leftSiderWidth = createStore<number>(leftSideWidth)
export const $leftSidebarMinStatus = createStore<boolean>(false)

type TFilterOptions = {
  domain: boolean,
  event: boolean,
  effect: boolean,
  store: boolean,
  function: boolean,
  process: boolean,
  title: string,
}

export const $unitsFilter = createLocalStore<TFilterOptions>('units-filter', {
  domain: true,
  event: true,
  effect: true,
  store: true,
  function: true,
  process: true,
  title: '',
})

export const $expandedKeys = createLocalStore<string[]>('tree-expanded-keys', ['root'])
