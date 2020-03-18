import {closeRightSider, openRightSider, toggleRightSider, toggleShowDeps} from './index'
import {$rightSider, $showDeps} from './state'
import {selectObject} from '../model'


$rightSider
  .on(toggleRightSider, state => !state)
  .on(closeRightSider, state => false)
  .on(openRightSider, state => true)
  .on(selectObject, () => true)

$showDeps
  .on(toggleShowDeps, state => !state)
