import React from 'react'
import {Layout, Menu, Breadcrumb, Button} from 'antd'
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons'
import {ObjectList} from '../components/ObjectList'
import {Toolbar} from '../components/Toolbar'
import {useStore} from 'effector-react'
import {$rightSider} from '../stores/layout/state'
import {closeRightSider, toggleRightSider} from '../stores/layout'


const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

export const GeneralLayout = ({children}) => {
  const rightSider = useStore($rightSider)

  return (
    <Layout>
      <Header className="header">
        <div className="logo"/>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{lineHeight: '64px'}}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={300} className="sider">
          <ObjectList/>
        </Sider>
        <Layout>
          <Toolbar/>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              border: '1px solid red',
            }}
          >
            {children}
            <Button onClick={toggleRightSider}>Toggle</Button>
          </Content>
        </Layout>
        <Sider width={400} className="sider" collapsed={!rightSider} collapsedWidth={0}>
          <Button onClick={closeRightSider}>Close</Button>
        </Sider>
      </Layout>
    </Layout>
  )
}
