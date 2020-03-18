import React, {useCallback} from 'react'
import {Dropdown, Menu, Tag, Tree} from 'antd'
import {
  ArrowRightOutlined,
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
import {$flattenModel, $taggedModel} from '../../stores/model/init'
import {omit, uniq, uniqBy} from 'ramda'
import {$showDeps} from '../../stores/layout/state'


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
  folder: domainContextMenu,
  domain: domainContextMenu,
  model: domainContextMenu,
  stores: storesContextMenu,
  store: storeContextMenu,
  events: eventsContextMenu,
  event: eventContextMenu,
  effects: effectsContextMenu,
  effect: effectContextMenu,
  processes: processesContextMenu,
  process: processContextMenu,
  sample: processContextMenu,
  watch: processContextMenu,
  on: processContextMenu,
  combine: processContextMenu,
  restore: processContextMenu,
  map: processContextMenu,
}

const icons = {
  model: <ApartmentOutlined/>,
  stores: <FolderOutlined/>,
  store: <AppstoreOutlined/>,
  combine: <AppstoreOutlined/>,
  map: <AppstoreOutlined/>,
  restore: <AppstoreOutlined/>,
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
  event: '#87d068',
  source: 'geekblue',
  sample: 'purple',
  target: 'red',
  watch: 'orange',
  clock: 'blue',
  combine: 'darkcyan',
  restore: '#999',
  map: 'darkgreen',
}

const resultColors = {
  event: '#87d068',
  store: '#108ee9',
}

const tagStyle = {padding: '0 4px', margin: '0 2px', height: 18, fontSize: 10, borderRadius: 3}

const tagsTypes = ['on', 'sample', 'merge', 'guard', 'combine', 'restore', 'split', 'forward', 'watch']

const ItemTitle = ({item, parent, flattenModel}) => {
  let tagged = false
  return (
    <>
      {item.title}{item.children ? ` (${item.children.length})` : ''}
      {' '}

      {/* process type */}
      {tagsTypes.includes(item.type) && (
        <Tag color={typeColors[item.type]} style={tagStyle}>
          {item.type}
        </Tag>
      )}

      {/* Кем является родитель для текущего элемента */}
      {parent && Object.keys(item).map((key, idx) => {
        return parent.id === item[key] && (
          <Tag color={typeColors[key]} style={tagStyle} key={idx}>
            {key}
          </Tag>
        )
      })}

      {parent && parent.type === 'combine' && item.tag && (
        <>
          <Tag color={typeColors[item.tag]} style={tagStyle}>
            {item.tag}
          </Tag>
        </>
      )}

      {parent && Object.keys(parent).map((key, idx) => {
        return item.id === parent[key] && (
          <Tag color={typeColors[key]} style={tagStyle} key={idx}>
            {key}
          </Tag>
        )
      })}

      {item.type === 'sample' && item.target && (
        <>
          <ArrowRightOutlined style={{margin: '0 5px'}}/>
          <Tag color={resultColors[flattenModel[item.target].type]} style={tagStyle}>
            {flattenModel[item.target].type}
          </Tag>
        </>
      )}

      {item.type === 'map' && (
        <>
          <Tag color={typeColors['map']} style={tagStyle}>
            map
          </Tag>
        </>
      )}
    </>
  )
}

const transformData = (data, flattenModel, level = '0', parent, showDeps) => {
  if (!data) return []

  return data.map((item, idx) => {
    let deps = []
    if (showDeps) deps = item.tag ? [] : flattenModel[item.id].tags.map(d => omit(['children', 'tags'], {...d.item, tag: d.tag}))

    return ({
      type: item.type,
      id: item.id,
      key: `${level}_${idx}`,
      title: (
        <TreeItem
          title={<ItemTitle item={item} parent={parent} flattenModel={flattenModel}/>}
          menu={menus[item.type]}
          icon={icons[item.type]}
        />
      ),
      children: transformData(
        uniqBy(i => i.id, tagsTypes.includes(item.type) ? (deps).concat(item.children || []) : (item.children || []).concat(deps)),
        flattenModel, `${level}_${idx}`,
        item,
        showDeps
      ),
    })
  })
}

export const ObjectList = () => {
  const showDeps = useStore($showDeps)
  const flattenModel = useStore($taggedModel)
  const data = transformData(useStore($model), flattenModel, '0', undefined, showDeps)

  const onSelect = useCallback((id, {node}) => {
    selectObject(node.id)
    openRightSider()
  }, [])

  console.log(showDeps)
  return (
    <Tree
      showIcon={true}
      defaultExpandAll
      onSelect={onSelect}
      treeData={data}
      style={{ width: 1200 }}
    />
  )
}