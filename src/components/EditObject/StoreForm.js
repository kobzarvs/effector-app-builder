import React, {useEffect, useState} from 'react'
import {Form, Input, Button, Checkbox, Table, message} from 'antd'
import {closeRightSider} from '../../stores/layout'
import {FormActions} from './assets/FormActions'
import {onFinishFailed} from './assets/helpers'
import {submitItem} from '../../stores/model'
import {pathOr} from 'ramda'


// const columns = [
//   {
//     title: 'Source name',
//     dataIndex: 'title',
//     key: 'name',
//   },
//   {
//     title: 'Source type',
//     dataIndex: 'type',
//     key: 'type',
//     render: type => {
//       switch(type) {
//
//       }
//       return (
//         <span>
//         {tags.map(tag => {
//           let color = tag.length > 5 ? 'geekblue' : 'green';
//           if (tag === 'loser') {
//             color = 'volcano';
//           }
//           return (
//             <Tag color={color} key={tag}>
//               {tag.toUpperCase()}
//             </Tag>
//           );
//         })}
//       </span>
//       )
//     },
//   },
// ]

export const StoreForm = ({data}) => {
  const [form] = Form.useForm()
  let defaultValue

  try {
    defaultValue = JSON.stringify(pathOr(null, ['params', 'defaultValue'], data), null, 2)
  } catch (e) {
    defaultValue = 'null'
  }

  const [value, setValue] = useState(defaultValue)
  const [undefinedValue, setUndefinedValue] = useState(defaultValue === 'null')

  const handleChangeUndefinedValue = e => {
    setUndefinedValue(e.target.checked)
    const newValue = e.target.checked ? 'null' : (value !== 'null' ? value : '\'\'')
    form.setFieldsValue({defaultValue: newValue})
  }

  const handlePretty = () => {
    try {
      // eslint-disable-next-line no-eval
      eval(`defaultValue=${form.getFieldValue('defaultValue')}`)
      const newValue = JSON.stringify(defaultValue, null, 2)
      form.setFieldsValue({defaultValue: newValue})
      setValue(newValue)
    } catch(e) {
      // console.error(e)
      message.error('Bad JSON format for defaultValue!')
    }
  }

  const onFinish = formData => {
    let value
    try {
      // eslint-disable-next-line no-eval
      value = eval(`value=${form.getFieldValue('defaultValue')}`)
      const values = {
        name: formData.name,
        defaultValue: value,
        config: {
          name: formData.name
        }
      }
      console.log('Success:', data.id, formData, values)
      submitItem({
        id: data.id,
        values
      })
    } catch(e) {
      // console.error(e)
      message.error('Error submit store!')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      name="basic"
      initialValues={{
        defaultValue,
        name: data.name,
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
            required: true,
          },
        ]}
      >
        <Input />
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
        <Input.TextArea style={{fontFamily: 'monospace'}} disabled={undefinedValue} rows={6} />
      </Form.Item>

      <div style={{
        marginTop: -8,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Form.Item
          name="undefinedValue"
          valuePropName="checked"
        >
          <Checkbox onChange={handleChangeUndefinedValue}>is NULL</Checkbox>
        </Form.Item>
        <Button
          type="primary"
          size="small"
          disabled={undefinedValue}
          onClick={handlePretty}
        >
          Pretty
        </Button>
      </div>

      {/*<Form.Item*/}
      {/*  label="Dependencies"*/}
      {/*>*/}
      {/*  /!*<Table columns={columns} dataSource={dataSource}/>*!/*/}
      {/*</Form.Item>*/}

      <FormActions />
    </Form>
  )
}
