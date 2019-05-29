import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import {Checkbox, Icon, Popup, Button} from 'semantic-ui-react'

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
  height: 60px;
  border: 1px black solid;
  margin: 4px;
  background-color: ${(props)=> props.completed ? 'lightgreen' : colorScheme(props.category, props.index)};
  transition:opacity 0.2s ease;
  display: flexbox;
  padding: 7px;
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
    console.log('dont delete this yet')
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
              onContextMenu={this.openPopup}
              >
              <div style={{display:'flexbox'}}>

                <Checkbox
                  onChange={this.markCompleted}
                  label={``}
                  style={{margin: '5px',padding: '5px'}}
                  checked={task.completed}
                  />
                </div>
              <div style={{ fontSize: '1.2rem',flexWrap: 'nowrap', backgroundColor: 'white', borderRadius: '15px', width: '85%', padding: '5px',paddingLeft: '15px', verticalAlign: 'middle'}}>

                {task.content}
                </div>
                  <Popup trigger={<Icon
                  name='remove'/>}
                  content={<Button color='red' content='Delete?' />}
                  on='click'
                  position='top right'
                  />
            </TaskElement>
        )}
    </Draggable>
  )
  }
}

export default PlannerTask
