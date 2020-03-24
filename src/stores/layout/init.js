import {
  closeRightSider,
  openRightSider,
  setLeftSiderWidth, toggleUnitsFilter,
  toggleLeftSidebar,
  toggleRightSider,
  toggleShowDeps, setUnitsFilter, setExpandedKeys,
} from './index'
import {
  $selectedObject,
  $leftSidebarMinStatus,
  $leftSiderWidth,
  $rightSider,
  $showDeps,
  $unitsFilter,
  $expandedKeys,
} from './state'


$rightSider
  .on(toggleRightSider, state => !state)
  .on(closeRightSider, state => false)
  .on(openRightSider, state => true)
  .on($selectedObject, (_, id) => !!id)

$showDeps
  .on(toggleShowDeps, state => !state)

$leftSiderWidth
  .on(setLeftSiderWidth, (state, width) => width)

$leftSidebarMinStatus
  .on(toggleLeftSidebar, (state, value) => {
    return (value === undefined || typeof value === 'object') ? !state : value
  })

$unitsFilter
  .on(toggleUnitsFilter, (state, unit) => ({...state, [unit]: !state[unit]}))
  .on(setUnitsFilter, (state, payload) => ({...state, ...payload}))

$expandedKeys
  .on(setExpandedKeys, (_, keys) => keys)
