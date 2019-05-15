import React, {Component} from 'react'
import Task from '../components/Task'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
margin: 8px;
border: 1px solid lightgrey;
border-radius: 2px;
width: 220px;
min-height:220px;
display: flex;
flex-direction: column;`

class Column extends Component {

  constructor(props){
    super(props)
    const setColumnTasks = () => props.tasks.filter(task =>
    props.columnTasks.includes(task.id))

    this.state = {
      tasks: setColumnTasks()
    }
  }

  render(){
    return(
      <div>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this.props.column.id}
              {this.state.tasks.map((task, index) => (
                <Task task={task} index={index}/>
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </div>
    )
  }
}

export default Column
