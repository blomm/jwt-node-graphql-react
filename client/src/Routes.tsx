import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import Header from './components/header'

export const Routes: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/register" component={Register} />

        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  )
}
