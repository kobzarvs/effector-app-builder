import React, {memo, useCallback, useMemo, useState} from 'react'
import {Button, Dropdown, Input, Spin, Tag, Tree} from 'antd'
import {DoubleLeftOutlined, DoubleRightOutlined} from '@ant-design/icons'
import {useStore} from 'effector-react'
import {intersection, keys, uniqBy} from 'ramda'
import styled from '@xstyled/styled-components'
import {UnitIcon} from './UnitIcon'
import {ModelContextMenu} from './ModelContextMenu'
import {
  openRightSider,
  selectObject, setExpandedKeys,
  setUnitsFilter,
  toggleLeftSidebar,
  toggleShowDeps,
  toggleUnitsFilter,
} from '../../stores/layout'
import {$expandedKeys, $leftSidebarMinStatus, $selectedObject, $showDeps, $unitsFilter} from '../../stores/layout/state'
import {$model} from '../../stores/model/state'
import {$flattenModel} from '../../stores/model/init'
import {loadModel} from '../../stores/model/persistModel'
import {unitColors} from './unitColors'


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

// const ItemTitleOld = ({item, parent, flattenModel}) => {
//   return (
//     <>
//       <UnitIcon unit={item.type} />
//       {' '}
//       {item.name}{item.children ? ` (${item.children.length})` : ''}
//       {' '}
//
//       {/* pre type */}
//       {preTypes.includes(item.type) && (
//         <StyledTag color={unitColors[item.type]} tag={item.type}>
//           {item.type}
//         </StyledTag>
//       )}
//
//       {/* Кем является родитель для текущего элемента */}
//       {parent && Object.keys(item).map((key, idx) => {
//         return parent.id === item[key] && (
//           <StyledTag color={unitColors[key]} key={idx}>
//             {key}
//           </StyledTag>
//         )
//       })}
//
//       {parent && Object.keys(parent).map((key, idx) => {
//         return item.id === parent[key] && (
//           <StyledTag color={unitColors[key]} key={idx}>
//             {key}
//           </StyledTag>
//         )
//       })}
//
//       {parent && parent.type === 'combine' && item.tag && (
//         <>
//           <StyledTag color={unitColors[item.tag]}>
//             {item.tag}
//           </StyledTag>
//         </>
//       )}
//       {' '}
//
//       {/* process type */}
//       {(tagsTypes.includes(item.type) || storeTypes.includes(item.type)) && (
//         <StyledTag color={unitColors[item.type]}>
//           {item.type}
//         </StyledTag>
//       )}
//
//       {item.type === 'sample' && item.target && (
//         <>
//           <ArrowRightOutlined style={{margin: '0 5px'}} />
//           <StyledTag color={resultColors[flattenModel[item.target].type]}>
//             {flattenModel[item.target].type}
//           </StyledTag>
//         </>
//       )}
//
//       {(item.type === 'combine' || item.type === 'map' || item.type === 'restore') && (
//         <>
//           <ArrowRightOutlined style={{margin: '0 5px'}} />
//           <StyledTag color={resultColors.store}>
//             store
//           </StyledTag>
//         </>
//       )}
//     </>
//   )
// }

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
    // if (showDeps) deps = pathOr([], [item.id, 'tags'], flattenModel).map(d => omit(['children', 'tags'], {
    //   ...d.item,
    //   tag: d.tag,
    // }))

    if (filter.hasOwnProperty(item.type) && !filter[item.type]) return null
    if (!filter.store && storeTypes.includes(item.type)) return null
    if (!filter.process && tagsTypes.includes(item.type)) return null

    return ({
      type: item.type,
      id: item.id,
      key: item.id, //`${level}_${idx}`,
      label: item.name,
      selectable: true,
      title: (
        <TreeItem
          title={<ItemTitle item={item} parent={parent} flattenModel={flattenModel} />}
          menu={ModelContextMenu({item})}
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
        // console.log('filter', item)
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
  const expandedKeys = useStore($expandedKeys)
  const allKeys = keys(useStore($flattenModel))
  const interKeys = intersection(expandedKeys, allKeys)
  console.log('expanded keys', interKeys)
  return (
    <div style={{
      overflow: 'auto',
      height: 'calc(100vh - var(--AppBar-height) - 32px)',
      opacity: loadPending ? .25 : 1,
      transition: 'opacity 300ms',
    }}>
      <Tree
        showIcon={true}
        // defaultExpandAll
        // defaultExpandParent
        // autoExpandParent
        onSelect={onSelect}
        treeData={data}
        style={{width: '100vw'}}
        selectedKeys={[selectedObject]}
        expandedKeys={interKeys}
        onExpand={keys => setExpandedKeys(keys)}
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

const FilterButton = React.memo(({title, unit}) => {
  const filter = useStore($unitsFilter)

  return (
    <Button title={title}
            icon={<UnitIcon unit={unit} color={false} />}
            onClick={() => toggleUnitsFilter(unit)}
            style={{
              background: filter[unit] ? 'white' : 'transparent',
              color: filter[unit] ? unitColors[unit] : '#999',
              border: 'none',
            }}
    />
  )
})

export const ProjectTree = ({style}) => {
  const leftSidebarMinStatus = useStore($leftSidebarMinStatus)
  const loadPending = useStore(loadModel.pending)
  const showDeps = useStore($showDeps)
  const flattenModel = useStore($flattenModel) //$taggedModel)
  const model = useStore($model)
  // const [filter, setFilter] = useState({
  //   domain: true,
  //   event: true,
  //   effect: true,
  //   store: true,
  //   function: true,
  //   process: true,
  //   title: '',
  // })
  const filter = useStore($unitsFilter)

  const data = useMemo(() => {
    return transformData(model, flattenModel, '0', undefined, showDeps, filter)
  }, [model, flattenModel, filter, showDeps])

  const onSelect = useCallback((id, {node}) => {
    selectObject(node.id)
    openRightSider()
  }, [])

  const handleChange = e => setUnitsFilter({title: e.target.value})

  const handleKeyDown = e => e.nativeEvent.code === 'Escape' && setUnitsFilter({title: ''})

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
          style={{flex: '1 0 200px', display: leftSidebarMinStatus ? 'none' : 'flex'}}
          onKeyDown={handleKeyDown}
          value={filter.title}
        />

        <Button icon={leftSidebarMinStatus ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                onClick={toggleLeftSidebar}
                style={{borderRadius: 0}}
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
          flex: '0 0 33px',
          padding: 0,
          width: 32,
        }}>
          <ButtonGroup>
            <FilterButton title="Domains" unit="domain" />
            <FilterButton title="Events" unit="event" />
            <FilterButton title="Effects" unit="effect" />
            <FilterButton title="Stores" unit="store" />
            <FilterButton title="Functions" unit="function" />
            <FilterButton title="Other" unit="process" />
            <Button title="Dependencies"
                    icon={<UnitIcon unit="deps" color={false} />}
                    type={showDeps && 'primary'}
                    onClick={toggleShowDeps}
                    style={{
                      background: showDeps ? 'white' : 'transparent',
                      color: showDeps ? unitColors.deps : '#999',
                      border: 'none',
                    }}
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