import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Subtask = styled.div`
  paddding: 5px;
`

class Task extends React.Component {

  findTaskById = (taskId) => {
    return this.props.allTasks.find(task => task.id === taskId)
  }

  renderSubtasks(task, column){
    let subtaskComponents
    if (task.subtaskIds.length > 0) {
      // debugger
      subtaskComponents = task.subtaskIds.map((subtaskId, index) => (
          <Draggable
          key={subtaskId}
          draggableId={`${column.id}-${subtaskId}`}
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
      )
      )
      return subtaskComponents
    }
  }

  render(){
    const {task, index, column} = this.props
    return (
      <Draggable
      key={task.id}
      draggableId={`${column.id}-${task.id}`}
      index={index}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task"
          >
          {task.content}

           <Droppable key = {`droppable-${task.id}`} droppableId={`${column.id}-${task.id}`} isCombineEnabled={true}>
             {(provided, snapshot) => (
               <div {...provided.droppableProps} ref={provided.innerRef}>
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
