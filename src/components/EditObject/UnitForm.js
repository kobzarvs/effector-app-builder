import React from 'react'
import {Form, Input, message} from 'antd'
import {FormActions} from './assets/FormActions'
import {submitItem} from '../../stores/model'
import {onFinishFailed} from './assets/helpers'
import {keys, pathOr} from 'ramda'
import {effectorModel} from '../../stores/model/effector-model'


const FieldComponent = ({param, params, form, ...props}) => {
  switch (param.type) {
    case 'string':
      return <Input {...props} />
    case 'text':
      return <Input.TextArea
        rows={10}
        {...props}
        style={{fontFamily: 'monospace'}}
      />
    default:
      return <Input {...props} />
  }
}

export const UnitForm = ({data}) => {
  const [form] = Form.useForm()
  const context = effectorModel[data.context]

  const onFinish = values => {
    console.log('Success:', data.id, values)
    submitItem({id: data.id, values})
  }

  return (
    <Form
      form={form}
      layout="vertical"
      name="basic"
      initialValues={context.params.reduce((acc, param) => {
        acc[param.key] = pathOr(undefined, ['params', param.key], data)
        // console.log('params', param, data[param], acc)
        return acc
      }, {})}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {context.params.map((param, i) => {
        return (
          <Form.Item
            key={i}
            label={param.name}
            name={param.key}
            rules={[
              {
                required: param.required,
              },
            ]}
          >
            <FieldComponent
              autoFocus={i === 0}
              param={param}
              params={context.params}
              form={form}
              onKeyDown={e => {
                if (e.ctrlKey && e.key === 'Delete') {
                  form.setFieldsValue({[param.key]: ''})
                }
              }}
              // onChange={e => {
              //   let {value} = e.target
              //   if (param['replace']) {
              //     keys(param['replace']).forEach(key => {
              //       const sub = form.getFieldValue(param['replace'][key])
              //       console.log(param.name, param['replace'], key, param['replace'][key], sub)
              //       value = value.replace(`{{${key}}}`, sub, 'gi')
              //     })
              //     form.setFieldsValue({
              //       [param.key]: value
              //     })
              //   }
              // }}
            />
          </Form.Item>
        )
      })}

      <FormActions />
    </Form>
  )
}
