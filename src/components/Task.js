import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon} from 'semantic-ui-react'

const TaskElement = styled.div`
  height: 40px;
  border: 1px black solid;
  background-color: ${(props)=> props.completed ? 'lightgreen' : 'white'};
`

class Task extends React.Component {

  markCompleted = () => {
    this.props.updateTask({
      id: this.props.task.id,
      date_completed: new Date(),
      completed: true
    })
  }

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id)
  }

  render(){
    const {task, columnId, index} = this.props
    return (
      <Draggable
      key={`${columnId}-${task.id}`}
      draggableId={`${columnId}-${task.id}`}
      index={index}
      >
        {(provided, snapshot) => (
          <TaskElement
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            completed={task.completed}
            onClick={this.props.onClickTask}
            onDoubleClick={this.addTaskToDay}
          >
            <Checkbox
              onChange={this.markCompleted}
              label={task.content}
              checked={task.completed}
              />
            <Icon onClick={this.deleteTask} name="remove"/>
          </TaskElement>
        )}
    </Draggable>
  )
  }
}

export default Task
