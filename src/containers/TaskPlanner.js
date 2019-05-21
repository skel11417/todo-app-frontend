import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import Column from '../components/Column'
import sampleData from '../sampleData'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  margin-top: 50px;
  width: 75%;
  border: black solid 1px;
`

class TaskPlanner extends React.Component {

  // logs the intended movement in the console
  log = (result) => {
    const {destination, source, draggableId} = result
    console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
  }

  onDragEnd = (result) => {
    console.log(result)
  }

  render(){
    console.log(this.props.tasks)
    return (
      <Container className="task-planner">
        <DragDropContext id="drag-drop-context"
        onDragEnd={this.onDragEnd}
        >
          <Column columnId="day" tasks={this.props.tasks} active={true}/>
          <Column columnId="all" tasks={this.props.tasks} active={true}/>
        </DragDropContext>
      </Container>
    );}
}

export default TaskPlanner;
