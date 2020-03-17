import {closeRightSider, openRightSider, toggleRightSider} from './index'
import {$rightSider} from './state'
import {selectObject} from '../model'


$rightSider
  .on(toggleRightSider, state => !state)
  .on(closeRightSider, state => false)
  .on(openRightSider, state => true)
  .on(selectObject, () => true)
