import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon} from 'semantic-ui-react'

const TaskElement = styled.div`
  height: 40px;
  border: 1px black solid;
  background-color: ${(props)=> props.completed ? 'lightgreen' : 'white'};
  display: ${props => props.activeColumn ? 'inherit': 'none' };
`

class PlannerTask extends React.Component {

  findTaskById = (taskId) => {
    return this.props.allTasks.find(task => task.id === taskId)
  }

  markCompleted = () => {
    this.props.updateTask({
      id: this.props.task.id,
      date_completed: new Date(),
      completed: !this.props.task.completed
    })
  }

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id)
  }

  addTaskToDay = () => {
    this.props.updateTask({
      id: this.props.task.id,
      scheduled_date: new Date()
    })
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
            activeColumn={this.props.active}
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

export default PlannerTask
