import React from 'react';
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import Column from '../components/Column'
import sampleData from '../sampleData'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

class TaskOrganizer extends React.Component {
  state = sampleData

  onDragEnd = (result) =>{
    if (result.destination){
      console.log('moving task', result.draggableId, 'from droppable', result.source.droppableId, 'index', result.source.index, "to droppable", result.destination.droppableId, 'index', result.destination.index )
    }
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
            />
          )}

        </DragDropContext>
      </Container>
    );}
}

export default TaskOrganizer;
