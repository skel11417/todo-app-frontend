import React, {Component} from 'react';
import Nav from './components/Nav'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import TaskPlanner from './containers/TaskPlanner'
import TaskPriority from './containers/TaskPriority'
import sampleData from './sampleData'
import Dashboard from './containers/Dashboard'
import BrainStorm from './containers/BrainStorm'

class App extends Component{

  state = {
    currentUser: null,
    tasks: sampleData.tasks
  }

  componentDidMount(){
    this.getTasks()
    this.setState({tasks: sampleData.tasks})
  }

  getTasks(){
    console.log('getting tasks')
  }

  render(){
    return (
      <Router>
        <Nav/>
        <div className="Main">
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/planner" render={() =><TaskPlanner tasks={this.state.tasks} />}/>
          <Route exact path="/sorter" component={TaskPriority}/>
          <Route exact path="/brainstorm" component={BrainStorm}/>
        </div>
      </Router>
    )
  }
}

export default App;
