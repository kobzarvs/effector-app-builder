import React, {useCallback} from 'react'
import {Button, Dropdown, Menu} from 'antd'
import {DownOutlined} from '@ant-design/icons'


const AddMenu = ({ onSelect }) => (
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
    <div>
      <Dropdown overlay={<AddMenu onSelect={handleMenuClick} />}>
        <Button>
          Create <DownOutlined/>
        </Button>
      </Dropdown>
    </div>
  )
}
