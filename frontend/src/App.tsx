import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppBar } from '@material-ui/core';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import useToken from './components/Token';

function App() {

  const { token, setToken } = useToken();

  if (!token || token==='') {
    return (
      <div>
        <AppBar position='static' className='Header'>
          <h2>To-Do App</h2>
        </AppBar>
        <div className='Wrapper'>
          <Login setToken={setToken}/>
        </div>
      </div>  
    );
  }

  return (
    <div>
      <AppBar position='static' className='Header'>
        <h2>CashLive To-Do</h2>
      </AppBar>
      <div className='Wrapper'>
        <BrowserRouter>
          <Switch>
            <Route path='/'>
              <Dashboard token={token} setToken={setToken}/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
