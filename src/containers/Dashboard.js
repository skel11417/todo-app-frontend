import React, {Component} from 'react'


class Dashboard extends Component {
  render(){
    const {tasks} = this.props

    return <div>This is the dashboard<br/>
      You have {`${tasks.length} task${tasks.length == 1 ? '': 's'}:`}
      <ol>
      {tasks.map(task => (<li>{task.content}</li>))}
      </ol>
    </div>
  }
}
export default Dashboard
