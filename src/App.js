import React from 'react'
import {Layout, Menu, Breadcrumb} from 'antd'
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams, Redirect,
} from 'react-router-dom'
import {GeneralLayout} from './layouts/GeneralLayout'
import {Dashboard} from './pages/Dashboard'
import {PageNotFound} from './pages/PageNotFound'


const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

export const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Dashboard/>
      </Route>
      <Route exact path="/404" component={PageNotFound} />
      <Redirect to="/404"/>
    </Switch>
  </Router>
)
