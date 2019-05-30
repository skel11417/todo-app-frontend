import React, {Component} from 'react'
import PlannerTask from '../components/PlannerTask'
import {Droppable} from 'react-beautiful-dnd'
import {Link} from 'react-router-dom'
import moment from 'moment'
import { Progress, Button, Grid } from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  transition:width 0.5s ease-in-out;
  min-height:440px;
  height: 700px;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;`

const ColumnTitle = styled.div`
  font-size: 1.8em;
  text-align: center;
  width: auto;
  padding: 5px
  display: flex;
`
// const ColumnHeader = styled.div`
//   font-size: 1.5em;
//   text-align: center;
//   flex-direction: column
// `

class StaticColumn extends Component {

  renderTasks = () => {
    const {columnTasks, columnId} = this.props
      return (
      columnTasks.map((task, index) => {
        return <PlannerTask
          key={`${columnId}-${task.id}`}
          task={task}
          columnId={columnId}
          index={task.timeframe_index}
          active={this.props.active}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          />
      })
    )
  }

  render(){
    const {columnId, columnTasks} = this.props
    const today = moment().format()
    const totalTasks = columnTasks.length
    const completedTasks = columnTasks.filter(task => task.completed === true).length

    const showTaskPlannerLink = () => {
      if (columnTasks.find(task=> moment(task.scheduledDate).startOf('day').format() === today)){
        return {display: 'none'}
      } else {
        return null
      }
    }

    return(
    <Container>
      <Grid columns={3} >
        <Grid.Row>
        <Grid.Column/>
        <Grid.Column>
          <ColumnTitle>
          Today's Tasks
          </ColumnTitle>
        </Grid.Column>
          <Grid.Column textAlign='right'>
          <Link to="/planner" >
            <Button
              color='green'
              content='Go to Task Planner'
              style={showTaskPlannerLink()}
              />
          </Link>
        </Grid.Column>
        </Grid.Row>
      </Grid>
      <Progress value={completedTasks} total={totalTasks} progress='ratio' indicating/>
      <Droppable droppableId={columnId} active={true}>
        {(provided, snapshot) => (
          <div style={{overflow: 'auto'}} {...provided.droppableProps}
          ref={provided.innerRef}>
            {this.renderTasks()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Container>
    )
  }
}

export default StaticColumn
