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

  onDragEnd = (result) =>{
    const {destination, source, draggableId} = result
    console.log('moving task', draggableId, 'from droppable', source.droppableId, 'index', source.index, "to droppable", destination.droppableId, 'index', destination.index )
    // only update state if drag destination is valid
    if (!destination){
      return null
    }

    // do not rerender if task has been dragged to its initial
    // location
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return null
    }

    if (destination.droppableId === source.droppableId){
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
        onDragEnd={this.onDragEnd}>
          {this.state.columns.map((column, index) =>(
            <Column
              key={index}
              column={column}
              tasks={this.state.tasks}
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
