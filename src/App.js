import React from 'react'
import {Layout, Menu} from 'antd'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {Dashboard} from './pages/Dashboard'
import {PageNotFound} from './pages/PageNotFound'
import './App.scss'


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
