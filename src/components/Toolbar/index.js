import React, {useCallback} from 'react'
import {Modal, Button, message, Popconfirm} from 'antd'
import {ExclamationCircleOutlined, RedoOutlined, UndoOutlined} from '@ant-design/icons'
import {$savedStatus} from '../../stores/model/state'
import {useStore} from 'effector-react'
import {loadModel, saveModel} from '../../stores/model/persistModel'
import {resetModel} from '../../stores/model'


export const Toolbar = () => {
  const savePending = useStore(saveModel.pending)
  const loadPending = useStore(loadModel.pending)
  const savedStatus = useStore($savedStatus)

  const handleMenuClick = useCallback((value) => {
    console.log('Menu selected', value)
  }, [])

  return (
    <div className="toolbar">
      <Button.Group>
        <Button onClick={() => Modal.confirm({
          title: 'Create new Project?',
          icon: <ExclamationCircleOutlined />,
          content: 'The current project will be destroyed',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            resetModel()
            message.success('The new project created a successful')
          },
        })}>
          New
        </Button>
        <Button>Open</Button>
        <Button>Import</Button>
        <Button>Export</Button>
        <Button>Build NPM</Button>
        <div style={{display: 'inline-block', width: 5}} />
        <Button icon={<UndoOutlined style={{color: 'blue'}} />}>Undo</Button>
        <Button icon={<RedoOutlined style={{color: 'blue'}} />}>Redo</Button>
      </Button.Group>
      <Button.Group>
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
      </Button.Group>
    </div>
  )
}
