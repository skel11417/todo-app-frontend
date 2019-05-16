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
    console.log(result)
    if (result.destination){
      console.log('moving task', result.draggableId, 'from droppable', result.source.droppableId, 'index', result.source.index, "to droppable", result.destination.droppableId, 'index', result.destination.index )
    }
  }

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
    this.setState({
      columns: updatedColumns
    })

  }

  render(){
    return (
      <Container className="TaskOrganizer">
        <DragDropContext id="id"
        onDragEnd={this.onDragEnd}>
          {this.state.columns.map((column, index) =>
            <Column
              key={index}
              column={column}
              tasks={this.state.tasks}
              columnTasks={column.tasks}
              onClick={this.changeTimeframe}
            />
          )}

        </DragDropContext>
      </Container>
    );}
}

export default TaskOrganizer;
