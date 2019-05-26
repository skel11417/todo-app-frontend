import React, {Component} from 'react';
import Nav from './components/Nav'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css';
import FullTaskPlanner from './containers/FullTaskPlanner'
import TaskSorter from './containers/TaskSorter'
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
    fetch('http://localhost:3000/tasks')
      .then(resp=> resp.json())
      .then(tasks => {
        this.setState({
          tasks: tasks
        })
    })
  }

  batchCreateTasks = (newTasks) => {
    const URL = "http://localhost:3000/tasks/batch_create"
    const options = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({new_tasks: newTasks})}

    fetch(URL, options)
      .then(resp => resp.json())
      .then(tasks => this.setState({tasks: tasks}))
  }

  updateCatIndexes = (categoryData) => {
    const URL = `http://localhost:3000/tasks/cat_indexes`
    const options = {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({category_data: categoryData})
    }

    fetch(URL, options)
      .then(resp => resp.json())
      .then(tasks => this.setState({tasks: tasks})
    )
  }

  updateTimeIndexes = (timeframeData) => {
    // debugger
    const URL = `http://localhost:3000/tasks/time_indexes`
    const options = {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({timeframe_data: timeframeData})
    }

    fetch(URL, options)
      .then(resp => resp.json())
      .then(tasks => this.setState({tasks: tasks})
    )
  }

  updateTask = (taskData)=>{
    const URL = `http://localhost:3000/tasks/${taskData.id}`
    const options = {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(taskData)
    }

    fetch(URL, options)
      .then(resp => resp.json())
      .then(tasks => this.setState({tasks: tasks})
    )
  }

  deleteTask = (taskId) => {
    const URL = `http://localhost:3000/tasks/${taskId}`
    const options = {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: taskId})
    }

    fetch(URL, options)
    .then(resp => resp.json())
    .then(tasks => this.setState({tasks: tasks})
  )
  }

  render(){
    // add taskProps variable to DRY up code

    return (
      <Router>
        <Route render={(props)=><Nav {...props}/>} />
        <div className="Main">

          <Route exact path="/" render={() => <Dashboard tasks={this.state.tasks}/> } />

          <Route exact path="/planner" render={() =>    <FullTaskPlanner tasks={this.state.tasks} deleteTask={this.deleteTask}
          updateTask={this.updateTask}
          updateTimeIndexes={this.updateTimeIndexes}/>}
          />

          <Route exact path="/sorter" render={()=><TaskSorter
            tasks={this.state.tasks}
            updateTask={this.updateTask}
            deleteTask={this.deleteTask}
            updateCatIndexes={this.updateCatIndexes}
            />}
          />

          <Route
            exact
            path="/mindsweeper"
            render={() => <BrainStorm
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
