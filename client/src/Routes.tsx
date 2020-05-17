import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
export const Routes: React.FC = () => {
  return (
    <Router>
      <header>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </header>

      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/register" component={Register} />

        <Route path="/login" component={Login} />
      </Switch>
    </Router>
    //   <div>{JSON.stringify(data)}</div>
    // </>
  )
}
