import React, {Fragment} from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon} from 'semantic-ui-react'

const TaskElement = styled.div`
  height: 40px;
  border: 1px black solid;
  background-color: ${(props)=> props.completed ? 'lightgreen' : 'white'};
`
const Clone = styled(TaskElement)`
  + div {
    display: none!important;
  }
`;

class Task extends React.Component {

  componentWillUnmount(){
   console.log('unmounted', this.props.columnId)
    // this.removeEventListener('mousemove', this.handleMouseMove);
    // this.removeEventListener('mouseup', this.handleMouseUp);
  }

  findTaskById = (taskId) => {
    return this.props.allTasks.find(task => task.id === taskId)
  }

  markCompleted = () => {
    this.props.markCompleted(this.props.task.id)
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
          >
            <Checkbox
              onChange={this.markCompleted}
              label={task.content}
              checked={task.completed}
              /><Icon onClick={this.deleteTask} name="remove"/>
          </TaskElement>
        )}
    </Draggable>
  )
  }
}

export default Task
