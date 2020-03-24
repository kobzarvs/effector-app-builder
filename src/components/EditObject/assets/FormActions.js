import React from 'react'
import {Button, Form} from 'antd'
import {closeRightSider} from '../../../stores/layout'


export const FormActions = () => (
  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
    <Form.Item>
      <Button onClick={closeRightSider}>
        Cancel
      </Button>
    </Form.Item>
    <div style={{width: 10}} />
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </div>
)
