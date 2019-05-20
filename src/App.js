import React, {Component} from 'react';
import Nav from './components/Nav'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import TaskOrganizer from './containers/TaskOrganizer'
import sampleData from './sampleData'
import Dashboard from './containers/Dashboard'
import BrainStorm from './containers/BrainStorm'

class App extends Component{
  
  render(){
    return (
      <Router>
        <Nav/>
        <div className="Main">
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/sort" component={TaskOrganizer}/>
          <Route exact path="/brainstorm" component={BrainStorm}/>
        </div>
      </Router>
    )
  }
}

export default App;
