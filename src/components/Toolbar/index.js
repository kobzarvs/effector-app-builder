import React, {useCallback} from 'react'
import {Button, Menu} from 'antd'
import {RedoOutlined, UndoOutlined} from '@ant-design/icons'
import {$savedStatus} from '../../stores/model/state'
import {useStore} from 'effector-react'
import {saveModel, loadModel} from '../../stores/model/persistModel'


const AddMenu = ({onSelect}) => (
  <Menu onSelect={onSelect}>
    <Menu.Item key="store">Store</Menu.Item>
    <Menu.Item key="event">Event</Menu.Item>
    <Menu.Item key="effect">Effect</Menu.Item>
  </Menu>
)

export const Toolbar = () => {
  const savePending = useStore(saveModel.pending)
  const loadPending = useStore(loadModel.pending)
  const savedStatus = useStore($savedStatus)

  const handleMenuClick = useCallback((value) => {
    console.log('Menu selected', value)
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
        <Button icon={<UndoOutlined style={{color: 'blue'}} />}>Undo</Button>
        <Button icon={<RedoOutlined style={{color: 'blue'}} />}>Redo</Button>
      </div>
      <div>
        <Button onClick={loadModel}
                disabled={loadPending || savePending}
                loading={loadPending}
        >
          Reload
        </Button>
        <Button type="primary"
                onClick={saveModel}
                disabled={savedStatus}
                loading={savePending}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
