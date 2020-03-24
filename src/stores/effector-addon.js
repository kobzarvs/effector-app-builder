import {attach, createEffect, createStore} from 'effector'
import {throttle} from 'lodash'


export const attachStore = ({source, effect, handler}) => {
  return attach({
    effect: createEffect({handler}),
    source,
    mapParams: (params, source) => ({params, source}),
  })
}
export const createLocalStore = (name, initialState, interval = 250) => {
  const load = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || initialState)
    } catch (e) {
      console.error(`Can't load store '${name}' from localStorage.`)
    }
    return initialState
  }
  const store = createStore(load(name), {name})
  store.save = throttle((key, value) => localStorage.setItem(key, JSON.stringify(value)), interval)
  store.load = load
  store.updates.watch(state => {
    try {
      store.save(name, state)
    } catch (e) {
      console.error(`Can't save store '${name}' to localStorage.`)
    }
  })

  return store
}

window.createLocalStore = createLocalStore
