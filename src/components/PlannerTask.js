import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon} from 'semantic-ui-react'

function colorScheme(category, index){
  const opacity = 0.8 - (index/20)
  const colors = {
    'A': `rgba(220, 88, 88, ${opacity})`,
    'B': `rgb(128, 0, 128, ${opacity})`,
    'C': `rgba(47, 21, 212, ${opacity})`
  }
  return colors[category]
}

const TaskElement = styled.div`
  height: 40px;
  border: 1px black solid;
  background-color: ${(props)=> props.completed ? 'lightgreen' : colorScheme(props.category, props.index)};
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
              category={task.category}
              index={index}
              activeColumn={active}
              onClick={this.props.onClickTask}
              onDoubleClick={this.addTaskToDay}
              >
              <Checkbox
                onChange={this.markCompleted}
                label={`${task.content}`}
                checked={task.completed}
                />
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
