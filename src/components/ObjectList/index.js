import React, {useCallback} from 'react'
import {Dropdown, Menu, Tag, Tree} from 'antd'
import {
  EyeOutlined,
  PullRequestOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  FunctionOutlined,
  NodeExpandOutlined,
  ThunderboltOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import {useStore} from 'effector-react'
import {openRightSider} from '../../stores/layout'
import {selectObject} from '../../stores/model'
import {$model} from '../../stores/model/state'
import {$flattenModel} from '../../stores/model/init'


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
  model: domainContextMenu,
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
  model: <ApartmentOutlined/>,
  stores: <FolderOutlined/>,
  store: <AppstoreOutlined/>,
  events: <FolderOutlined/>,
  event: <ThunderboltOutlined/>,
  effects: <FolderOutlined/>,
  effect: <FunctionOutlined/>,
  processes: <FolderOutlined/>,
  process: <NodeExpandOutlined/>,
  folder: <FolderOutlined/>,
  sample: <PullRequestOutlined/>,
  watch: <EyeOutlined/>,
  on: <ThunderboltOutlined/>,
}

const findTargets = (id, tree) => {
  return []
}

const typeColors = {
  on: 'green',
  source: 'geekblue',
  sample: 'purple',
  target: 'red',
  watch: 'orange'
}

const tagStyle = {padding: '0 3px', margin: '0 2px', height: 18, fontSize: 10}

const tagsTypes = ['on', 'sample', 'merge', 'guard', 'combine', 'restore', 'split', 'forward']

const ItemTitle = ({item, parent}) => {
  return (
    <>
      {item.title}{item.children ? ` (${item.children.length})` : ''}
      {' '}
      {tagsTypes.includes(item.type) && (
        <Tag color={typeColors[item.type]} style={tagStyle}>
          {item.type}
        </Tag>
      )}
      {parent && Object.keys(item).map((key, idx) => {
        return parent.id === item[key] && (
          <Tag color={typeColors[key]} style={tagStyle} key={idx}>
            {key}
          </Tag>
        )
      })}
      {parent && Object.keys(parent).map((key, idx) => {
        return item.id === parent[key] && (
          <Tag color={typeColors[key]} style={tagStyle} key={idx}>
            {key}
          </Tag>
        )
      })}
    </>
  )
}

const transformData = (data, flattenModel, level = '0', parent) => {
  if (!data) return []

  return data.map((item, idx) => {
    const sources = flattenModel.filter(i => i.target === item.id).map(i => {
      const {children, ...base} = i
      return base
    })

    return ({
      type: item.type,
      id: item.id,
      key: `${level}_${idx}`,
      title: (
        <TreeItem
          title={<ItemTitle item={item} parent={parent}/>}
          menu={menus[item.type]}
          icon={icons[item.type]}
        />
      ),
      children: transformData(sources.concat(item.children || []), flattenModel, `${level}_${idx}`, item),
    })
  })
}

export const ObjectList = () => {
  const flattenModel = useStore($flattenModel)
  console.log('flat', flattenModel)
  const data = transformData(useStore($model), Object.values(flattenModel))

  const onSelect = useCallback((id, {node}) => {
    console.log(id, node.id)
    selectObject(node.id)
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