import {closeRightSider, openRightSider, selectObject, toggleRightSider} from './index'
import {$rightSider} from './state'


$rightSider
  .on(toggleRightSider, state => !state)
  .on(closeRightSider, state => false)
  .on(openRightSider, state => true)
  .on(selectObject, () => true)
