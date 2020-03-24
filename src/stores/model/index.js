import {createEvent, merge} from 'effector'


export const onContextMenuSelected = createEvent()
export const resetModel = createEvent()

export const shouldRecalcTree = createEvent()

export const newUnitCreated = createEvent()
export const submitItem = createEvent()
export const removeUnit = createEvent()
export const modelChanged = merge([newUnitCreated, submitItem, removeUnit])
