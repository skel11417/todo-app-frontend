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
    tasks: [],
    newTasks: []
  }

  componentDidMount(){
    this.getTasks()
  }

  getTasks(){
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
      .then(resp => resp.json())
      .then(newTasks = this.setState({
        newTasks: newTasks
      }))
  }

  markCompleted = (taskId) =>{
    URL = `http://localhost:3000/tasks/${taskId}`
    const options = {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: taskId, completed: true})}

    fetch(URL, options)
      .then(()=>this.getTasks())
  }

  deleteTask = (taskId) => {
    URL = `http://localhost:3000/tasks/${taskId}`
    const options = {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: taskId})
    }

    fetch(URL, options)
      .then(()=>this.getTasks())
  }

  render(){
    return (
      <Router>
        <Route render={(props)=><Nav {...props}/>} />
        <div className="Main">
          <Route exact path="/" render={() => <Dashboard tasks={this.state.tasks}/> } />
          <Route exact path="/planner" render={() => <TaskPlanner tasks={this.state.tasks} deleteTask={this.deleteTask}
          markCompleted={this.markCompleted}
          newTasks={this.state.newTasks}/>}/>
          <Route exact path="/sorter" component={TaskPriority}/>
          <Route
            exact
            path="/mindsweeper"
            render={
              () => <BrainStorm
                batchCreateTasks={this.batchCreateTasks}
                />
              }
          />
        </div>
      </Router>
    )
  }
}

export default App;
