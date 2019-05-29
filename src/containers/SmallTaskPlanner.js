import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import Column from '../components/Column'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  margin-top: 50px;
  width: 80%;
  border: black solid 1px;
`

class TaskPlanner extends React.Component {

  // logs the intended movement in the console
  log = (result) => {
    const {destination, source, draggableId} = result
    if (destination !== null){
      console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
    }
  }

  onDragEnd = (result) => {
    this.log(result)
  }

  render(){
    const today = new Date()
    const endOfMonth = new Date(today.getYear() + 100, today.getMonth(), 0)
    const allTasks = this.props.tasks.filter(task=> task.scheduled_date === null)

    const filterTasks = (date) => {
      const filteredTasks = []
      date.setHours(0,0,0,0)
      this.props.tasks.forEach(task => {
        if (task.scheduled_date){
          let dbDate = new Date(task.scheduled_date)
          dbDate.setHours(0,0,0,0)
          if (dbDate - date === 0){
            filteredTasks.push(task)
          }
        }
      })
      return filteredTasks
    }

    const dayTasks = filterTasks(today)

    return (
      <Container className="task-planner">
        <DragDropContext id="drag-drop-context"
        onDragEnd={this.onDragEnd}
        >
          <Column columnId="day"
          updateTask={this.props.updateTask}
          deleteTask={this.props.deleteTask}
          columnTasks={dayTasks} active={true}/>

          <Column columnId="all" columnTasks={allTasks}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          active={true}/>
        </DragDropContext>
      </Container>
    );}
}

export default TaskPlanner;
