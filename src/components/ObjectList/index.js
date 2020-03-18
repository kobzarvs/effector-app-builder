import React, {useCallback, useState} from 'react'
import {Button, Dropdown, Menu, Input, Tag, Tree} from 'antd'
import {
  LinkOutlined,
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
import {openRightSider, toggleShowDeps} from '../../stores/layout'
import {selectObject} from '../../stores/model'
import {$model} from '../../stores/model/state'
import {$flattenModel, $taggedModel} from '../../stores/model/init'
import {omit, uniq, uniqBy} from 'ramda'
import {$showDeps} from '../../stores/layout/state'
import styled from '@xstyled/styled-components'


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
  sample: <NodeExpandOutlined/>,
  watch: <EyeOutlined/>,
  on: <ThunderboltOutlined/>,
  deps: <LinkOutlined/>,
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

const StyledTag = styled(Tag)`
  padding: 0 4px;
  margin: 0 2px;
  height: 18px;
  font-size: 10px;
  border-radius: 3px;
  width: 45px;
  text-align: center;
`

const preTypes = ['on', 'watch', 'map']
const tagsTypes = ['sample', 'merge', 'guard', 'split', 'forward']
const storeTypes = ['combine', 'restore', 'store']

const ItemTitle = ({item, parent, flattenModel}) => {
  let tagged = false
  return (
    <>
      {/* pre type */}
      {preTypes.includes(item.type) && (
        <StyledTag color={typeColors[item.type]} tag={item.type}>
          {item.type}
        </StyledTag>
      )}

      {/* Кем является родитель для текущего элемента */}
      {parent && Object.keys(item).map((key, idx) => {
        return parent.id === item[key] && (
          <StyledTag color={typeColors[key]} key={idx}>
            {key}
          </StyledTag>
        )
      })}

      {parent && Object.keys(parent).map((key, idx) => {
        return item.id === parent[key] && (
          <StyledTag color={typeColors[key]} key={idx}>
            {key}
          </StyledTag>
        )
      })}

      {parent && parent.type === 'combine' && item.tag && (
        <>
          <StyledTag color={typeColors[item.tag]}>
            {item.tag}
          </StyledTag>
        </>
      )}
      {' '}

      {icons[item.type]}
      {' '}
      {item.title}{item.children ? ` (${item.children.length})` : ''}
      {' '}

      {/* process type */}
      {tagsTypes.includes(item.type) && (
        <StyledTag color={typeColors[item.type]}>
          {item.type}
        </StyledTag>
      )}

      {item.type === 'sample' && item.target && (
        <>
          <ArrowRightOutlined style={{margin: '0 5px'}}/>
          <StyledTag color={resultColors[flattenModel[item.target].type]}>
            {flattenModel[item.target].type}
          </StyledTag>
        </>
      )}
    </>
  )
}

const transformData = (data, flattenModel, level = '0', parent, showDeps, filter, filterPass = true) => {
  if (!data) return []

  return data.map((item, idx) => {
    let deps = []
    if (showDeps) deps = item.tag
      ? []
      : flattenModel[item.id].tags.map(d => omit(['children', 'tags'], {...d.item, tag: d.tag}))

    if (filter.hasOwnProperty(item.type) && !filter[item.type]) return null
    if (!filter.store && storeTypes.includes(item.type)) return null
    if (!filter.process && tagsTypes.includes(item.type)) return null
    if (item.type !== 'folder' && item.type !== 'model' && filter.title && item.title.toLowerCase().indexOf(filter.title.toLowerCase()) === -1) return null

    return ({
      type: item.type,
      id: item.id,
      key: `${level}_${idx}`,
      title: (
        <TreeItem
          title={<ItemTitle item={item} parent={parent} flattenModel={flattenModel}/>}
          menu={menus[item.type]}
          // icon={icons[item.type]}
        />
      ),
      children: transformData(
        uniqBy(i => i.id, tagsTypes.includes(item.type) ? (deps).concat(item.children || []) : (item.children || []).concat(deps)),
        flattenModel, `${level}_${idx}`,
        item,
        showDeps,
        filter,
        filterPass,
      ),
    })
  }).filter(Boolean)
}

export const ObjectList = () => {
  const showDeps = useStore($showDeps)
  const flattenModel = useStore($taggedModel)
  const [filter, setFilter] = useState({
    event: true,
    effect: true,
    store: true,
    process: true,
    title: '',
  })
  const data = transformData(useStore($model), flattenModel, '0', undefined, showDeps, filter)

  const onSelect = useCallback((id, {node}) => {
    selectObject(node.id)
    openRightSider()
  }, [])

  const handleChange = (e) => setFilter({...filter, title: e.target.value})

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Input.Search placeholder="Search" onChange={handleChange} style={{flex: '1 0 300px'}}/>
        <Button.Group>
          <Button icon={icons['event']} type={filter.event && 'primary'}
                  onClick={() => setFilter({...filter, event: !filter.event})}/>
          <Button icon={icons['effect']} type={filter.effect && 'primary'}
                  onClick={() => setFilter({...filter, effect: !filter.effect})}/>
          <Button icon={icons['store']} type={filter.store && 'primary'}
                  onClick={() => setFilter({...filter, store: !filter.store})}/>
          <Button icon={icons['process']} type={filter.process && 'primary'}
                  onClick={() => setFilter({...filter, process: !filter.process})}/>
          <Button icon={icons['deps']} type={showDeps && 'primary'} onClick={toggleShowDeps}/>
        </Button.Group>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100vh - 73px - 32px)' }}>
        <Tree
          showIcon={true}
          defaultExpandAll
          onSelect={onSelect}
          treeData={data}
          style={{width: 1200}}
        />
      </div>
    </>
  )
}