import React, {memo, useCallback, useMemo, useState} from 'react'
import {Button, Dropdown, Input, Spin, Tag, Tree} from 'antd'
import {ArrowRightOutlined, FilterOutlined} from '@ant-design/icons'
import {useStore} from 'effector-react'
import {openRightSider, toggleShowDeps} from '../../stores/layout'
import {selectObject} from '../../stores/model'
import {$model, $selectedObject} from '../../stores/model/state'
import {$taggedModel} from '../../stores/model/init'
import {omit, uniqBy} from 'ramda'
import {$showDeps} from '../../stores/layout/state'
import styled from '@xstyled/styled-components'
import {unitColors} from './unitColors'
import {UnitIcon} from './UnitIcon'
import {ModelContextMenu} from './ModelContextMenu'
import {loadModel} from '../../stores/model/persistModel'


const TreeItem = ({title, menu, icon}) => (
  <Dropdown overlay={menu} trigger={['contextMenu']}>
    <div>{icon} {title}</div>
  </Dropdown>
)


const resultColors = {
  event: '#87d068',
  store: '#108ee9',
}

const StyledTag = styled(Tag)`
  padding: 0 4px;
  margin: 0 2px;
  line-height: 1.5;
  font-size: 10px;
  border-radius: 3px;
  width: 45px;
  text-align: center;
`

const preTypes = ['on', 'watch']
const tagsTypes = ['map', 'sample', 'merge', 'guard', 'split', 'forward']
const storeTypes = ['combine', 'restore']

const ItemTitleOld = ({item, parent, flattenModel}) => {
  return (
    <>
      <UnitIcon unit={item.type} />
      {' '}
      {item.name}{item.children ? ` (${item.children.length})` : ''}
      {' '}

      {/* pre type */}
      {preTypes.includes(item.type) && (
        <StyledTag color={unitColors[item.type]} tag={item.type}>
          {item.type}
        </StyledTag>
      )}

      {/* Кем является родитель для текущего элемента */}
      {parent && Object.keys(item).map((key, idx) => {
        return parent.id === item[key] && (
          <StyledTag color={unitColors[key]} key={idx}>
            {key}
          </StyledTag>
        )
      })}

      {parent && Object.keys(parent).map((key, idx) => {
        return item.id === parent[key] && (
          <StyledTag color={unitColors[key]} key={idx}>
            {key}
          </StyledTag>
        )
      })}

      {parent && parent.type === 'combine' && item.tag && (
        <>
          <StyledTag color={unitColors[item.tag]}>
            {item.tag}
          </StyledTag>
        </>
      )}
      {' '}

      {/* process type */}
      {(tagsTypes.includes(item.type) || storeTypes.includes(item.type)) && (
        <StyledTag color={unitColors[item.type]}>
          {item.type}
        </StyledTag>
      )}

      {item.type === 'sample' && item.target && (
        <>
          <ArrowRightOutlined style={{margin: '0 5px'}} />
          <StyledTag color={resultColors[flattenModel[item.target].type]}>
            {flattenModel[item.target].type}
          </StyledTag>
        </>
      )}

      {(item.type === 'combine' || item.type === 'map' || item.type === 'restore') && (
        <>
          <ArrowRightOutlined style={{margin: '0 5px'}} />
          <StyledTag color={resultColors.store}>
            store
          </StyledTag>
        </>
      )}
    </>
  )
}

const ItemTitle = ({item, parent, flattenModel}) => {
  return (
    <div>
      <UnitIcon unit={item.type} />
      {' '}
      {item.name}
    </div>
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

    return ({
      type: item.type,
      id: item.id,
      key: item.id, //`${level}_${idx}`,
      label: item.title,
      selectable: true,
      title: (
        <TreeItem
          title={<ItemTitle item={item} parent={parent} flattenModel={flattenModel} />}
          menu={<ModelContextMenu item={item} />}
        />
      ),
      children: transformData(
        uniqBy(i => i.id, tagsTypes.includes(item.type) ? (deps).concat(item.children || []) : (item.children || []).concat(deps)),
        flattenModel, `${level}_${idx}`,
        item,
        showDeps,
        filter,
        filterPass,
      ).filter(item => {
        if (item.children.length === 0 && filter.title &&
          item.label.toLowerCase().indexOf(filter.title.toLowerCase()) === -1
        ) {
          return false
        }
        return true
      }),
    })
  }).filter(Boolean)
}

const ScrolledTree = memo(({onSelect, data, loadPending}) => {
  const selectedObject = useStore($selectedObject)
  return (
    <div style={{overflow: 'auto', height: '100%', opacity: loadPending ? .25 : 1, transition: 'opacity 300ms'}}>
      <Tree
        showIcon={true}
        defaultExpandAll
        defaultExpandParent
        autoExpandParent
        onSelect={onSelect}
        treeData={data}
        style={{width: '100vw'}}
        selectedKeys={[selectedObject.id]}
      />
    </div>
  )
})

const ButtonGroup = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .ant-btn {
    border-radius: 0;
  }
`

export const ProjectTree = ({style}) => {
  const loadPending = useStore(loadModel.pending)
  const showDeps = useStore($showDeps)
  const flattenModel = useStore($taggedModel)
  const model = useStore($model)
  const [filter, setFilter] = useState({
    domain: true,
    event: true,
    effect: true,
    store: true,
    function: true,
    process: true,
    title: '',
  })

  const data = useMemo(() => {
    return transformData(model, flattenModel, '0', undefined, showDeps, filter)
  }, [model, flattenModel, filter, showDeps])

  const onSelect = useCallback((id, {node}) => {
    selectObject(node)
    openRightSider()
  }, [])

  const handleChange = e => setFilter({...filter, title: e.target.value})

  const handleKeyDown = e => e.nativeEvent.code === 'Escape' && setFilter({...filter, title: ''})

  return (
    <div style={{
      display: 'flex',
      flexFlow: 'column nowrap',
      ...style,
    }}>
      <div style={{display: 'flex'}}>
        <Input.Search
          placeholder="Search"
          onChange={handleChange}
          style={{flex: '1 0 200px'}}
          onKeyDown={handleKeyDown}
          value={filter.title}
        />
      </div>
      <div style={{
        // border: '2px solid red',
        display: 'flex',
        flexFlow: 'row nowrap',
        height: '100%',
      }}>
        <div style={{
          borderRight: '1px solid #ccc',
          background: '#e9e9e9',
          flex: '0 0 32px',
          padding: 0,
          width: 32,
        }}>
          <ButtonGroup>
            <Button title="Domains"
                    icon={<UnitIcon unit="domain" color={false} />}
                    type={filter.domain && 'primary'}
                    onClick={() => setFilter({...filter, domain: !filter.domain})}
            />
            <Button title="Events"
                    icon={<UnitIcon unit="event" color={false} />}
                    type={filter.event && 'primary'}
                    onClick={() => setFilter({...filter, event: !filter.event})}
            />
            <Button title="Effects"
                    icon={<UnitIcon unit="effect" color={false} />}
                    type={filter.effect && 'primary'}
                    onClick={() => setFilter({...filter, effect: !filter.effect})}
            />
            <Button title="Stores"
                    icon={<UnitIcon unit="store" color={false} />}
                    type={filter.store && 'primary'}
                    onClick={() => setFilter({...filter, store: !filter.store})}
            />
            <Button title="Functions"
                    icon={<UnitIcon unit="function" color={false} />}
                    type={filter.store && 'primary'}
                    onClick={() => setFilter({...filter, function: !filter.function})}
            />
            <Button title="Other"
                    icon={<UnitIcon unit="process" color={false} />}
                    type={filter.process && 'primary'}
                    onClick={() => setFilter({...filter, process: !filter.process})}
            />
            <Button title="Dependencies"
                    icon={<UnitIcon unit="deps" color={false} />}
                    type={showDeps && 'primary'}
                    onClick={toggleShowDeps}
            />
          </ButtonGroup>
        </div>
        <ScrolledTree onSelect={onSelect} data={data} loadPending={loadPending} />
        {loadPending && (
          <div style={{position: 'absolute', top: 'calc(50% - 50px)', left: 'calc(50% - 80px)', textAlign: 'center'}}>
            <div style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>Loading models...</div>
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  )
}