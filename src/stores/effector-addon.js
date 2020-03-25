import {attach, createEffect, createStore} from 'effector'
import {throttle} from 'lodash'


export const attachStore = ({source, effect, handler}) => {
  return attach({
    effect: createEffect({handler}),
    source,
    mapParams: (params, source) => ({params, source}),
  })
}

export const createLocalStore = (name, initialState, options = {}) => {
  const {interval = 250, prevent = false} = options

  if (!createLocalStore.preventedLeavePage) {
    window.addEventListener('beforeunload', createLocalStore.preventLeavePage)
    createLocalStore.preventedLeavePage = true
  }

  const load = (key) => {
    try {
      const result = localStorage.getItem(key)
      return result === null ? initialState : JSON.parse(result)
    } catch (e) {
      console.error(`Can't load store '${name}' from localStorage.`)
    }
    return initialState
  }

  const store = createStore(load(name), {name})
  store.storageKey = name
  store.prevent = prevent
  store.save = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      store.unsavedState = undefined
    } catch (e) {
      console.error(`Can't save store '${name}' to localStorage.`)
    }
  }

  const throttledSave = throttle(store.save, interval)

  createLocalStore.stores = createLocalStore.stores || []
  createLocalStore.stores.push(store)

  store.watch(state => {
    store.unsavedState = state
    throttledSave(name, state)
  })

  return store
}

createLocalStore.preventLeavePage = (e) => {
  e.preventDefault()

  if (createLocalStore.stores.some(store => store.prevent && store.unsavedState !== undefined)) {
    e.returnValue = 'There is pending work. Sure you want to leave?'
  }

  setTimeout(() => {
    createLocalStore.stores.forEach(store => {
      store.unsavedState !== undefined && store.save(store.storageKey, store.unsavedState)
    })
  })

  return e.returnValue
}
