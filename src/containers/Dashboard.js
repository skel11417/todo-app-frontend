import React, {Component} from 'react'
import SmallTaskPlanner from './SmallTaskPlanner'
import Stats from '../components/Stats'
import styled from 'styled-components'
import moment from 'moment'

const DashContainer = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 50px;
  width: 50%;
`

class Dashboard extends Component {

  render(){
    const today = moment().format("dddd, MMMM D")

    return (
      <DashContainer>
        <h1>{today}</h1>
        <SmallTaskPlanner
          tasks={this.props.tasks}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          updateTimeIndexes={this.props.updateTimeIndexes}
        />
        <Stats tasks={this.props.tasks}/>
    </DashContainer>
  )
  }
}
export default Dashboard
