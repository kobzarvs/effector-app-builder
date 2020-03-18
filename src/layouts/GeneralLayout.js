import React from 'react'
import {Button, Layout, Menu, Typography} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import {ObjectList} from '../components/ObjectList'
import {Toolbar} from '../components/Toolbar'
import {useStore} from 'effector-react'
import {$rightSider} from '../stores/layout/state'
import {toggleRightSider} from '../stores/layout'
import {EditObject} from '../components/EditObject'


const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

export const GeneralLayout = ({children}) => {
  const rightSider = useStore($rightSider)

  return (
    <Layout>
      <Header className="header">
        <div style={{ fontSize: '1.5em' }}>Effector App Builder</div>
        <div>
          <UserOutlined style={{ marginRight: 5 }}/>
          example@gmail.com
        </div>
      </Header>
      <Toolbar/>
      <Layout>
        <Sider width={400} className="sider">
          <ObjectList/>
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              border: '1px solid #ccc',
            }}
          >
            {children}
          </Content>
        </Layout>
        <Sider width={400} className="right-sider" collapsed={!rightSider} collapsedWidth={0}>
          <EditObject/>
        </Sider>
      </Layout>
    </Layout>
  )
}
