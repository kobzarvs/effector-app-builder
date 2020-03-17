import React, {useCallback} from 'react'
import {Dropdown, Menu, Tree} from 'antd'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  CarryOutOutlined,
  FormOutlined,
  FunctionOutlined,
  NodeExpandOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {useStore} from 'effector-react'
import {createStore} from 'effector'
import {toggleRightSider} from '../../stores/layout'


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

const TreeItem = ({title, menu, icon}) => (
  <Dropdown overlay={menu} trigger={['contextMenu']}>
    <div>{icon} {title}</div>
  </Dropdown>
)

const $store = createStore([
  {
    title: <TreeItem title="Default Domain" menu={domainContextMenu} icon={<ApartmentOutlined/>}/>,
    key: '0-0',
    children: [
      {
        title: (
          <TreeItem title="Stores" menu={storesContextMenu} icon={<AppstoreOutlined/>}/>
        ),
        key: '0-0-0',
        children: [
          { title: <TreeItem title="$store1" menu={storeContextMenu}/>, key: "0-0-0-0" },
          { title: <TreeItem title="$store2" menu={storeContextMenu}/>, key: "0-0-0-1" },
          { title: <TreeItem title="$store3" menu={storeContextMenu}/>, key: "0-0-0-2" },
        ],
      },

      {
        title: 'Events',
        key: '0-0-1',
        icon: <ThunderboltOutlined/>,
        children: [{title: 'leaf', key: '0-0-1-0', icon: <CarryOutOutlined/>}],
      },

      {
        title: 'Effects',
        key: '0-0-2',
        icon: <FunctionOutlined/>,
        children: [
          {title: 'leaf', key: '0-0-2-0', icon: <CarryOutOutlined/>},
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <CarryOutOutlined/>,
            switcherIcon: <FormOutlined/>,
          },
        ],
      },

      {
        title: 'Processes',
        key: '0-0-3',
        icon: <NodeExpandOutlined/>,
        children: [
          {title: 'leaf', key: '0-0-2-0', icon: <CarryOutOutlined/>},
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <CarryOutOutlined/>,
            switcherIcon: <FormOutlined/>,
          },
        ],
      },
    ],
  },
])

export const ObjectList = () => {
  const data = useStore($store)
  const onSelect = useCallback((...vals) => {
    console.log(vals)
    toggleRightSider()
  }, [])

  return (
    <Tree
      // showLine={true}
      showIcon={true}
      defaultExpandedKeys={['0-0-0']}
      onSelect={onSelect}
      treeData={data}
      // onRightClick={(e, node) => {
      //   console.log(e, node)
      // }}
    />
  )
}