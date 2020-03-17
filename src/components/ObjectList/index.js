import React, {useCallback} from 'react'
import {Dropdown, Menu, Tree} from 'antd'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  FunctionOutlined,
  NodeExpandOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {useStore} from 'effector-react'
import {openRightSider} from '../../stores/layout'
import {selectObject} from '../../stores/model'
import {$model} from '../../stores/model/state'


const domainContextMenu = (
  <Menu>
    <Menu.Item key="1">Create</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
)

const storesContextMenu = (
  <Menu>
    <Menu.Item key="1">Create</Menu.Item>
  </Menu>
)

const storeContextMenu = (
  <Menu>
    <Menu.Item key="3">Rename</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
)

const eventsContextMenu = (
  <Menu>
    <Menu.Item key="1">Create</Menu.Item>
  </Menu>
)

const eventContextMenu = (
  <Menu>
    <Menu.Item key="3">Rename</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
)

const effectsContextMenu = (
  <Menu>
    <Menu.Item key="1">Create</Menu.Item>
  </Menu>
)

const effectContextMenu = (
  <Menu>
    <Menu.Item key="3">Rename</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
)

const processesContextMenu = (
  <Menu>
    <Menu.Item key="1">Create</Menu.Item>
  </Menu>
)

const processContextMenu = (
  <Menu>
    <Menu.Item key="3">Rename</Menu.Item>
    <Menu.Item key="2">Delete</Menu.Item>
  </Menu>
)


const TreeItem = ({title, menu, icon}) => (
  <Dropdown overlay={menu} trigger={['contextMenu']}>
    <div>{icon} {title}</div>
  </Dropdown>
)

const menus = {
  domain: domainContextMenu,
  stores: storesContextMenu,
  store: storeContextMenu,
  events: eventsContextMenu,
  event: eventContextMenu,
  effects: effectsContextMenu,
  effect: effectContextMenu,
  processes: processesContextMenu,
  process: processContextMenu,
}

const icons = {
  domain: <ApartmentOutlined/>,
  stores: <AppstoreOutlined/>,
  store: undefined,
  events: <ThunderboltOutlined/>,
  event: undefined,
  effects: <FunctionOutlined/>,
  effect: undefined,
  processes: <NodeExpandOutlined/>,
  process: undefined,
}

const transformData = (data) => {
  return data.map(item => ({
    type: item.type,
    key: item.id,
    title: (
      <TreeItem
        title={`${item.title}${item.children ? ` (${item.children.length})` : ''}`}
        menu={menus[item.type]}
        icon={icons[item.type]}
      />
    ),
    children: item.children && transformData(item.children),
  }))
}

export const ObjectList = () => {
  const data = transformData(useStore($model))
  const onSelect = useCallback(id => {
    console.log(id)
    selectObject(id)
    openRightSider()
  }, [])

  return (
    <Tree
      showIcon={true}
      defaultExpandAll
      onSelect={onSelect}
      treeData={data}
    />
  )
}