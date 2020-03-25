import React, {useCallback, useEffect, useState} from 'react'
import {Layout} from 'antd'
import {ThunderboltOutlined, UserOutlined} from '@ant-design/icons'
import {ProjectTree} from '../components/ProjectTree'
import {Toolbar} from '../components/Toolbar'
import {useStore} from 'effector-react'
import {$leftSidebarMinStatus, $leftSiderWidth, $rightSider} from '../stores/layout/state'
import {setLeftSiderWidth, toggleLeftSidebar} from '../stores/layout'
import {EditObject} from '../components/EditObject'
import {Resizer} from '../components/Resizer'
import styled from '@xstyled/styled-components'
import {debounce, throttle} from 'lodash'


const {Header, Content, Sider} = Layout

const Version = styled.span`
  font-size: 14px;
  position: absolute;
  top: -7px;
  right: -75px;
  color: yellow;
`

export const GeneralLayout = ({children}) => {
  const rightSider = useStore($rightSider)
  const leftSiderWidth = useStore($leftSiderWidth)
  const leftSidebarMinStatus = useStore($leftSidebarMinStatus)
  const [maxWidth, setMaxWidth] = useState(window.innerWidth)

  const handleResize = useCallback(throttle(() => {
    setMaxWidth(window.innerWidth)
    if (leftSiderWidth > 248 && leftSiderWidth > maxWidth - (rightSider ? 401 : 1)) {
      setLeftSiderWidth(maxWidth - (rightSider ? 401 : 1))
    }
    if (maxWidth - (rightSider ? 401 : 1) < 248) {
      toggleLeftSidebar(true)
    }
  }, 50), [maxWidth, setMaxWidth, leftSiderWidth, rightSider, setLeftSiderWidth])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <Layout>
      <Header className="header">
        <a className="logo-href"
           href="https://github.com/kobzarvs/effector-app-builder"
           rel="noopener noreferrer"
           target="_blank"
        >
          <div style={{fontSize: '1.5em', position: 'relative', width: 'auto'}}>
            <ThunderboltOutlined />
            <span style={{margin: '0 5px'}}>Effector App Builder</span>
            <Version>(alpha ver.)</Version>
          </div>
        </a>
        <div>
          <UserOutlined style={{marginRight: 5}} />
          example@gmail.com
        </div>
      </Header>
      <Toolbar />
      <Layout>
        <Sider width={leftSidebarMinStatus ? 33 : leftSiderWidth} className="left-sider">
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexFlow: 'row nowrap',
            position: 'relative',
            padding: 0,
          }}>
            <ProjectTree style={{
              flex: `0 1 ${leftSiderWidth - 7}px`,
              height: '100%',
              width: leftSiderWidth - 7,
            }} />
            {!leftSidebarMinStatus && (
              <Resizer
                color="#ddd"
                border="#aaa"
                direction="vertical"
                value={leftSiderWidth}
                min={240}
                max={maxWidth - (rightSider ? 401 : 1)}
                onResize={setLeftSiderWidth}
                save="left-sider-width"
              />
            )}
          </div>
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
          {rightSider && <EditObject />}
        </Sider>
      </Layout>
    </Layout>
  )
}
