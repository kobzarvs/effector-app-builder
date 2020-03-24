import {createStore} from 'effector'

export const $rightSider = createStore(false)
export const $selectedObject = createStore(null)
export const $showDeps = createStore(true)

let leftSideWidth
try {
  leftSideWidth = JSON.parse(localStorage.getItem('left-sider-width'))
} catch(e) {
  //
}
export const $leftSiderWidth = createStore(leftSideWidth || 500)
