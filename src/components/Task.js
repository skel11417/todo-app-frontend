import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'

class Task extends React.Component {

  renderSubtasks(task, column){
    let subtasks
    if (task.subtasks.length > 0) {
      subtasks = task.subtasks.map((subtask, index) => (
        <Draggable
          key={subtask.id}
          draggableId={`${column.id}-${subtask.id}`}
          index={index}
        >
          {(provided, snapshot) =>(
            <div className="bordered-box"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              {subtask.content}
            </div>
          )}
        </Draggable>
      )
      )
    }
    return subtasks
  }

  render(){
    const {task, index, column} = this.props
    console.log(column.id)
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
            isDragging={snapshot.isDragging}
            className="bordered-box"
          >
          {task.content}

           <Droppable key = {task.id} droppableId={`${column.id}-${task.id}`} isCombineEnabled={true}>
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
