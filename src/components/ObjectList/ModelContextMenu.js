import {onContextMenuSelected} from '../../stores/model'
import {path, pathOr} from 'ramda'
import {effectorModel} from '../../stores/model/effector-model'
import {Menu} from 'antd'
import React from 'react'
import styled from '@xstyled/styled-components'


const StyledMenu = styled(Menu)`
  border: 1px solid #ccc;
  min-width: 160px;
  box-shadow: 2px 2px 10px #aaa !important;
  
  .ant-menu-item {
    height: 24px;
    line-height: 18px;
    font-size: 13px;
    margin: 0 !important;
    padding: 0 12px !important;
    transition: none;
    :hover {
      color: white;
      background: var(--primary);
    }
  }
`

export const ModelContextMenu = ({item}) => {
  return (
    <StyledMenu onClick={({key, domEvent}) => {
      domEvent.preventDefault()
      domEvent.stopPropagation()
      switch (key) {
        case 'copy':
        case 'remove':
          const cmd = path([item.context, key], effectorModel)
          cmd && cmd({item})
          break
        default:
          onContextMenuSelected({item, menuId: key})
      }
    }}>
      {pathOr([], [item.context, 'cmd'], effectorModel).map((cmdId, i) => (
        effectorModel[cmdId].type === 'divider'
          ? <hr key={`hr${i}`} style={{color: '#ccc'}} />
          : <Menu.Item key={cmdId}>{effectorModel[cmdId].label}</Menu.Item>
      ))}
      {pathOr(0, [item.context, 'cmd', 'length'], effectorModel) && <hr />}
      <Menu.Item key="copy">Copy...</Menu.Item>
      <Menu.Item key="remove">Delete</Menu.Item>
    </StyledMenu>
  )
}
