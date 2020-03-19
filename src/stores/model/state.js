import {createStore} from 'effector'


export const $selectedObject = createStore(null)

export const $model = createStore([
  {
    type: 'folder',
    title: 'Project',
    id: 'root',
    children: [
      {
        type: 'folder', id: 'nodels', title: 'models',
        children: [
          {
            type: 'model', id: 'root_models_todos', title: 'todos',
            children: [
              {type: 'event', title: 'insert', id: 'root_models_todos_insert'},
              {type: 'event', title: 'remove', id: 'root_models_todos_remove'},
              {type: 'event', title: 'change', id: 'root_models_todos_change'},
              {type: 'event', title: 'reset', id: 'root_models_todos_reset'},
              {
                type: 'event', title: 'submit', id: 'root_models_todos_submit',
                children: [
                  {type: 'watch', title: 'prevent default', id: 'root_models_todos_submit_watch1'},
                ],
              },
              {type: 'effect', title: 'loadTodos', id: 'loadTodos'},
              {type: 'effect', title: 'saveTodos', id: 'saveTodos'},
              {
                type: 'store', title: '$todos', id: 'root_models_todos_$todos', value: ['hello, world!'],
                children: [
                  {type: 'on', title: 'insert', id: 'root_models_todos_insert1'},
                  {type: 'on', title: 'remove', id: 'root_models_todos_remove1'},
                  {type: 'on', title: 'change', id: 'root_models_todos_change1'},
                  {type: 'on', title: 'reset', id: 'root_models_todos_reset1'},
                ],
              },
              {
                type: 'store', title: '$input', id: 'root_models_todos_$input', value: '',
                children: [
                  {type: 'map', title: '$upperCaseInput', id: '$upperCaseInput' }
                ]
              },
              {
                type: 'sample',
                title: 'add new item',
                id: 'root_models_todos_input_sample1',
                source: 'root_models_todos_$input',
                clock: 'root_models_todos_submit',
                // target: 'root_models_todos_submit',
                target: 'root_models_todos_insert',
              },
              {
                type: 'combine',
                title: '$combinedStore',
                id: '$combinedStore',
                stores: ['root_models_todos_$todos', 'root_models_todos_$input'],
                children: [
                  {
                    type: 'map', id: '$mappedStore2', title: '$mappedStore2',
                    children: [
                      {type: 'on', title: 'reset', id: 'root_models_todos_reset1'},
                    ],
                  },
                ],
              },
              {
                type: 'restore',
                title: '$restoredStore',
                id: '$restoredStore',
                event: 'root_models_todos_insert',
                defaultState: undefined,
              },
            ],
          },
        ],
      },
    ],
  },
])
