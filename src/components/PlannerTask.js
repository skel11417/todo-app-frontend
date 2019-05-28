import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon} from 'semantic-ui-react'

const TaskElement = styled.div`
  height: 40px;
  border: 1px black solid;
  background-color: ${(props)=> props.completed ? 'lightgreen' : 'white'};
  transition:opacity 0.2s ease;
  opacity: ${(props) => props.activeColumn ? '1' : '0'}
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
    const {task, columnId, index, active} = this.props
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
              activeColumn={active}
              onClick={this.props.onClickTask}
              onDoubleClick={this.addTaskToDay}
              >
              <div>
              <Checkbox
                onChange={this.markCompleted}
                label={`${task.timeframe_index}-${this.props.index}-${task.content} ${task.scheduled_date}`}
                checked={task.completed}
                />
              </div>
              <Icon
                onClick={this.deleteTask}
                name="remove"
                />
            </TaskElement>
        )}
    </Draggable>
  )
  }
}

export default PlannerTask
