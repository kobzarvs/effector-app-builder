import React, {useCallback} from 'react'
import {Button, Dropdown, Menu} from 'antd'
import {DownOutlined, UndoOutlined, RedoOutlined} from '@ant-design/icons'


const AddMenu = ({onSelect}) => (
  <Menu onSelect={onSelect}>
    <Menu.Item key="store">Store</Menu.Item>
    <Menu.Item key="event">Event</Menu.Item>
    <Menu.Item key="effect">Effect</Menu.Item>
  </Menu>
)

export const Toolbar = () => {
  const handleMenuClick = useCallback((value) => {
    console.log('selected', value)
  }, [])

  return (
    <div className="toolbar">
      {/*<Dropdown overlay={<AddMenu onSelect={handleMenuClick} />}>*/}
      {/*  <Button>*/}
      {/*    File <DownOutlined/>*/}
      {/*  </Button>*/}
      {/*</Dropdown>*/}
      <div>
        <Button>New</Button>
        <Button>Open</Button>
        <Button>Import</Button>
        <Button>Export</Button>
        <Button>Build NPM</Button>
        {' '}
        <Button icon={<UndoOutlined style={{color: 'blue'}}/>}>Undo</Button>
        <Button icon={<RedoOutlined style={{color: 'blue'}}/>}>Redo</Button>
      </div>
      <div>
        <Button type="danger">Clear</Button>
        <Button type="primary">Save</Button>
      </div>
    </div>
  )
}
