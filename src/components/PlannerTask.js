import React from 'react'
import {Checkbox, Icon, Popup, Button} from 'semantic-ui-react'
import {Draggable} from 'react-beautiful-dnd'
import moment from 'moment'
import styled from 'styled-components'

function colorScheme(category, index){
  const opacity = 1 - (index/12)
  const colors = {
    'A': `rgba(250, 88, 88, ${opacity})`,
    'B': `rgb(128, 0, 128, ${opacity})`,
    'C': `rgba(47, 21, 212, ${opacity})`
  }
  return colors[category]
}

const TaskElement = styled.div`
  border: 2px solid ${(props)=> props.completed ? 'green' : colorScheme(props.category, props.index)};
  width: 100%;
  border-radius: 5px;
  background-color: ${(props)=> props.completed ? 'lightgreen' : colorScheme(props.category, props.index)};
  display: flexbox;
`
const TaskWrapper = styled.div`
  height: 60px;
  border-radius: 5px;
  margin: 2px;
  background-color: white;
  transition:opacity 0.2s ease;
  display: flexbox;
  opacity: ${(props) => props.activeColumn ? '1' : '0'}
  ${(props) => props.incomplete}
  animation: ${(props) => props.lateTask ? 'glowing 3000ms infinite' : null}
`

class PlannerTask extends React.Component {

  toggleTaskCompleted = () => {
    this.props.updateTask({
      id: this.props.task.id,
      date_completed: new Date(),
      completed: !this.props.task.completed
    })
  }

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id)
  }

  render(){
    const {task, columnId, index, active} = this.props

    let lateTask = !task.completed && moment(task.scheduled_date).startOf('day') < moment().startOf('day')

    return (
      <Draggable
      key={`${columnId}-${task.id}`}
      draggableId={`${columnId}-${task.id}`}
      index={index}
      >
        {(provided, snapshot) => (
          <TaskWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          activeColumn={active}
          lateTask={lateTask}
          ref={provided.innerRef}
          >
            <TaskElement
              completed={task.completed}
              category={task.category}
              index={index}
              onClick={this.props.onClickTask}
              onContextMenu={this.openPopup}
              >
              <div style={{display:'flexbox'}}>
                <Checkbox
                  onChange={this.toggleTaskCompleted}
                  style={{margin: '5px',padding: '5px'}}
                  checked={task.completed}
                  />
                </div>
              <div style={{ fontSize: '1.3rem',flexWrap: 'nowrap', backgroundColor: 'white', borderRadius: '5px', width: '85%', padding: '5px', marginLeft: '10px', paddingLeft: '15px', verticalAlign: 'middle'}}>
                {task.content}
                </div>
                  <Popup trigger={<Icon
                  name='remove'/>}
                  content={<Button color='red' content='Delete?' />}
                  on='click'
                  onClick={this.deleteTask}
                  position='top right'
                  />
            </TaskElement>
          </TaskWrapper>
        )}
    </Draggable>
  )
  }
}

export default PlannerTask
