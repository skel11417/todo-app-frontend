import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import Column from '../components/Column'
import sampleData from '../sampleData'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  width: 75%;
  border: black solid 1px;
`

class TaskOrganizer extends React.Component {
  state = sampleData

  reorderSubtasks = ({destination, source, draggableId}) => {
    const taskId = parseInt(destination.droppableId
                  .split("-")[2])
    let newTasks = [...this.state.tasks]
    let updatedTask = newTasks.find(task => task.id === taskId)

    const subtaskId = updatedTask.subtaskIds
                        .splice(source.index, 1)[0]

    updatedTask.subtaskIds
      .splice(destination.index, 0, subtaskId)

    this.setState({
      tasks: newTasks
    })
  }

  addSubtaskToTask = ({destination, source, draggableId}) => {
    console.log('moving a subtask to a task')
    //remove subtask from column
    let newTasks = [...this.state.tasks]
    let newColumns = [...this.state.columns]
    let columnId = draggableId.split('-')[0]
    let updatedColumn = newColumns.find(column => column.id === columnId)
    let newSubtaskId = parseInt(draggableId.split('-')[1])
    updatedColumn.tasks.splice(source.index, 1)
    // add it to the tasks subtask array
    let taskId = parseInt(destination.droppableId.split('-')[2])
    let updatedTask = newTasks.find(task => task.id === taskId)

    updatedTask.subtaskIds.splice(destination.index, 0, newSubtaskId)
    this.setState({
      columns: newColumns,
      tasks: newTasks
    })
  }

  moveSubtaskToTasks = ({destination, source, draggableId}) => {
    console.log('moving a subtask to parent task list')
    this.log({destination, source, draggableId})

    let newTasks = [...this.state.tasks]
    let newColumns = [...this.state.columns]
    // create a helper method that returns an object
    // with all of the variables you want
    //

    // get the id of the task you are moving
    const subtaskId = parseInt(draggableId
                  .split("-")[2])
    const subtaskIndex = source.index
    const taskId = parseInt(source.droppableId
                  .split("-")[2])
    const columnId = source.droppableId.split("-")[1]

    // remove the task from the task's subtask array
    let task = newTasks.find(task => task.id === taskId)
    task.subtaskIds.splice(subtaskIndex, 1)

    // add it to the column at the new index
    let updatedTask = newTasks.find(task => task.id === taskId)
    let updatedColumn = newColumns.find(column => column.id === columnId)
    updatedColumn.tasks.splice(destination.index, 0, subtaskId)
    // This isn't updating state and yet somehow renders properly
  }

  // logs the intended movement in the console
  log = (result) => {
    const {destination, source, draggableId} = result
    console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
  }

  onDragStart = (result) =>{
    console.log(result)
  }

  onDragEnd = (result) =>{
    const {destination, source, draggableId} = result
    // only update state if drag destination is valid
    if (!destination){
      return null
    }

    // do not rerender if task has been dragged to its initial
    // location
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return null
    }
    this.log(result)
    // reorder tasks
    if (destination.droppableId === source.droppableId){

      // call subtask function
      if (destination.droppableId.includes('-')){
        this.reorderSubtasks(result)
        return null
      }

      const column = this.state.columns.find( column => column.id === source.droppableId)
      const columnIndex = this.state.columns.indexOf(column)
      const newTasks = [...column.tasks]

      // use splice to remove moved item since the actual
      // task id is a string including the column key
      const taskId = newTasks.splice(source.index, 1)[0]

      newTasks.splice(destination.index, 0, taskId)

      const newColumn = {...column, tasks: newTasks}
      const newColumns = [...this.state.columns]
      newColumns[columnIndex] = newColumn

      this.setState({
        columns: newColumns
      })
    }

    if (destination.droppableId.includes('-') && !source.droppableId.includes('-')){
      this.addSubtaskToTask(result)
      return null
    }

    if(!destination.droppableId.includes('-') && source.droppableId.includes('-')) {
      this.moveSubtaskToTasks(result)
      return null
    }

  }

  // sets selected column and its neighbor's visibility
  // to true and returns
  updateColumnVisibility = (column) => {
    let columns = [...this.state.columns]
    let newIndex = columns.indexOf(column)
    const activeArray = [false, false, false, false]
    switch (newIndex) {
      case 0:
      case 1:
        activeArray[0] = true
        activeArray[1] = true
        break
      case 2:
        activeArray[1] = true
        activeArray[2] = true
        break
      case 3:
        activeArray[2] = true
        activeArray[3] = true
        break
      default:
        break
    }
    for (let i = 0; i< columns.length; i++){
      columns[i].active = activeArray[i]
    }

    return columns
  }

  changeTimeframe = (column) => {
    let updatedColumns = this.updateColumnVisibility(column)
    if (this.state.columns !== updatedColumns){
      this.setState({
        columns: updatedColumns
      })
    }
  }

  render(){
    return (
      <Container className="TaskOrganizer">
        <DragDropContext id="id"
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        >

          {this.state.columns.map((column, index) =>(
            <Column
              key={column.id}
              column={column}
              allTasks={this.state.tasks}
              columnTasks={column.tasks}
              onClick={this.changeTimeframe}
            />
            )
          )}
        </DragDropContext>
      </Container>
    );}
}

export default TaskOrganizer;
