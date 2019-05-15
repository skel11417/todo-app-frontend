import React, {Component} from 'react';
import Nav from './components/Nav'
import Main from './containers/Main'
import TaskOrganizer from './containers/TaskOrganizer'
import './App.css';

class App extends Component{
  render(){
    return (
      <div>
      <Nav/>
      <Main/>
      </div>
    )
  }
}

export default App;
