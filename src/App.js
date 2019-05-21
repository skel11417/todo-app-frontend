import React, {Component} from 'react';
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, withRouter} from 'react-router-dom'
import './App.css';
import TaskPlanner from './containers/TaskPlanner'
import TaskPriority from './containers/TaskPriority'
import sampleData from './sampleData'
import Dashboard from './containers/Dashboard'
import BrainStorm from './containers/BrainStorm'

class App extends Component{

  state = {
    currentUser: null,
    tasks: []
  }

  componentDidMount(){
    this.getTasks()
  }

  getTasks(){
    console.log('getting tasks')
    fetch('http://localhost:3000/tasks')
      .then(resp=> resp.json())
      .then(tasks => {
        this.setState({
          tasks: tasks
        })
      })
  }

  batchCreateTasks = (newTasks) => {
    URL = "http://localhost:3000/tasks/batch_create"
    const options = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({new_tasks: newTasks})}

    fetch(URL, options)
      .then(this.goToTaskList)
      .then(()=>this.getTasks())
  }

  goToTaskList = () =>{
    console.log('going to task list')
  }

  render(){
    return (
      <Router>
        <Nav/>
        <div className="Main">
          <Route exact path="/" render={() => <Dashboard tasks={this.state.tasks}/> } />
          <Route exact path="/planner" render={() => <TaskPlanner tasks={this.state.tasks} />}/>
          <Route exact path="/sorter" component={TaskPriority}/>
          <Route
            exact
            path="/brainstorm"
            render={
              () => <BrainStorm
                batchCreateTasks={this.batchCreateTasks}
                goToTaskList={this.goToTaskList}
                />

              }
          />
        </div>
      </Router>
    )
  }
}

export default App;
