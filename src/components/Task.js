import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox} from 'semantic-ui-react'

const Subtask = styled.div`
  paddding: 5px;
  border: 5px;
`

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
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={column.active ? "task" : "hidden-task"}
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
          </div>
        )}
    </Draggable>
  )
  }
}

export default Task
