import React, {Component} from 'react'
import PlannerTask from '../components/PlannerTask'
import {Droppable} from 'react-beautiful-dnd'
import { Progress } from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  transition:width 0.5s ease-in-out;
  min-height:440px;
  height: 700px;
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;`

const ColumnTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
`

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
    const totalTasks = columnTasks.length
    const completedTasks = columnTasks.filter(task => task.completed === true).length

    return(
    <Container >
      <ColumnTitle>
      Today's Tasks
      </ColumnTitle>
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
