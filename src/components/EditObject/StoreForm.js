import React, {useState} from 'react'
import {Form, Input, Button, Checkbox} from 'antd'
import {closeRightSider} from '../../stores/layout'


export const StoreForm = ({data}) => {
  const [undefinedValue, setUndefinedValue] = useState(typeof data.value === 'undefined')

  const handleChangeUndefinedValue = e => setUndefinedValue(e.target.checked)

  const onFinish = values => {
    console.log('Success:', values)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      layout="vertical"
      name="basic"
      initialValues={{
        defaultValue: JSON.stringify(data.value, null, 2),
        name: data.title,
        undefinedValue,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Store name"
        name="name"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Default state"
        name="defaultValue"
        rules={[
          {
            required: true,
            message: 'Please input default value!',
          },
        ]}
      >
        <Input.TextArea style={{fontFamily: 'monospace'}} disabled={undefinedValue} rows={10}/>
      </Form.Item>

      <Form.Item name="undefinedValue" valuePropName="checked">
        <Checkbox onChange={handleChangeUndefinedValue}>undefined value</Checkbox>
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item>
          <Button onClick={closeRightSider}>
            Cancel
          </Button>
        </Form.Item>
        <div style={{ width: 10 }}></div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}
