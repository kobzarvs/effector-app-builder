import {createStore} from 'effector'


export const $selectedObject = createStore(null)

export const $model = createStore([
  {
    type: 'domain',
    title: 'Default Domain',
    id: 'root',
    children: [
      {
        type: 'stores',
        title: 'Stores',
        id: 'root_stores',
        children: [
          {type: 'store', title: '$store1', id: 'root_stores_$store1', value: {'name': 'John', 'age': '28'}},
          {type: 'store', title: '$store2', id: 'root_stores_$store2', value: undefined},
        ],
      },

      {
        type: 'events',
        title: 'Events',
        id: 'root_events',
        children: [
          {type: 'event', title: 'event1', id: 'root_events_event1'},
        ],
      },

      {
        type: 'effects',
        title: 'Effects',
        id: 'root_effects',
        children: [
          {type: 'effect', title: 'effect1', id: 'root_effects_effect1'},
        ],
      },

      {
        type: 'processes',
        title: 'Processes',
        id: 'root_processes',
        children: [
          {type: 'process', title: 'process1', id: 'root_processes_process1'},
        ],
      },
    ],
  },
])
