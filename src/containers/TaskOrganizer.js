import React from 'react';
import { DragDropContext, Droppable} from "react-beautiful-dnd";
import Task from '../components/Task'
import sampleData from '../sampleData'

class TaskOrganizer extends React.Component {
  state = sampleData

  onDragEnd = (result) =>{
    if (result.destination){
      console.log('moving task', result.draggableId, 'from droppable', result.source.droppableId, 'index', result.source.index, "to droppable", result.destination.droppableId, 'index', result.destination.index )
    }
  }

  render(){
    return (
      <div className="TaskOrganizer">
        <DragDropContext id="id"
        onDragEnd={this.onDragEnd}>
          This is the Dragging context
          <Droppable droppableId="day">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                This is the droppable area
                {this.state.tasks.map((task, index) => (
                  <Task task={task} index={index}/>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );}
}

export default TaskOrganizer;
