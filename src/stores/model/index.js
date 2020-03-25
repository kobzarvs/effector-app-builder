//@flow
import {createEvent, merge} from 'effector'


export const onContextMenuSelected = createEvent<{| item: {}, menuId: string |}>()
export const resetModel = createEvent<void>()

export const shouldRecalcTree = createEvent<void>()

export const newUnitCreated = createEvent<{item: {}}>()
export const submitItem = createEvent<{| id: string, values: {} |}>()
export const removeUnit = createEvent<{| item: {} |}>()
export const modelChanged = merge<any>([newUnitCreated, submitItem, removeUnit])
