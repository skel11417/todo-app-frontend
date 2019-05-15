import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'

class Task extends React.Component {

  renderSubtasks(task){
    let subtasks
    if (task.subtasks.length > 0) {
      subtasks = task.subtasks.map((subtask, index) => (
        <Draggable
          key={subtask.id}
          draggableId={subtask.id}
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
    const {task, index} = this.props

    return (
      <Draggable
      key={task.id}
      draggableId={task.id}
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

           <Droppable key = {task.id} droppableId={task.id} isCombineEnabled={true}>
             {(provided, snapshot) => (
               <div {...provided.droppableProps} ref={provided.innerRef}>
               {this.renderSubtasks(task)}
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
