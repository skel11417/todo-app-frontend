import React, {Fragment} from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox} from 'semantic-ui-react'

const Subtask = styled.div`
  paddding: 5px;
  border: 5px;
`

const TaskElement = styled.div`
  display: ${props => props.column.active? 'inherit': 'none' };
`
const Clone = styled(TaskElement)`
  + div {
    display: none!important;
  }
`;

class Task extends React.Component {

  componentWillUnmount(){
    console.log('unmounted', this.props.column.id)
    // this.removeEventListener('mousemove', this.handleMouseMove);
    // this.removeEventListener('mouseup', this.handleMouseUp);
  }

  findTaskById = (taskId) => {
    return this.props.allTasks.find(task => task.id === taskId)
  }

  renderSubtasks(task, column){
    let subtaskComponents
    if (task.subtaskIds.length > 0) {
      // debugger
      subtaskComponents = task.subtaskIds.map((subtaskId, index) => {
        return (
          <Draggable
          key={`${column.id}-${task.id}-${subtaskId}`}
          draggableId={`${column.id}-${task.id}-${subtaskId}`}
          index={index}
        >
          {(provided, snapshot) =>(
            <Subtask
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              {this.findTaskById(subtaskId).content}
            </Subtask>
          )}
        </Draggable>
      )}
      )
      return subtaskComponents
    }
  }

  render(){
    const {task, index, column} = this.props
    return (
      <Draggable
      key={`${column.id}-${task.id}`}
      draggableId={`${column.id}-${task.id}`}
      index={index}
      >
        {(provided, snapshot) => (
          <Fragment>
          <TaskElement
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            column={this.props.column}
          >
          <Checkbox label=
          {task.content}/>


           <Droppable key={`droppable-${column.id}-${task.id}`}
           droppableId={`droppable-${column.id}-${task.id}`} isCombineEnabled={true}>
             {(provided, snapshot) => (
               <div style={{backgroundColor: "pink"}} {...provided.droppableProps} ref={provided.innerRef}>
               {this.renderSubtasks(task, column)}
               {provided.placeholder}
               </div>
             )}

            </Droppable>
          </TaskElement>
          {snapshot.isDragging && (
  <Clone column={column}><Checkbox label=
  {task.content}/></Clone>
)}
          </Fragment>
        )}
    </Draggable>
  )
  }
}

export default Task
