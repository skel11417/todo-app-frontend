import React, {Component} from 'react'
import Task from '../components/Task'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  /* margin: 8px; */
  border: 1px solid lightgrey;
  border-radius: 2px;
  max-width: auto;
  width: ${props => props.column.active ? '45%' : '5%'};
  transition:width 0.5s ease-in-out;
  min-height:440px;
  padding: 5px;
  display: flex;
  flex-direction: column;`

const ColumnTitle = styled.button`
  font-size: 1.5em;
`

class Column extends Component {

  constructor(props){
    super(props)

    const setColumnTasks = () =>
      props.tasks.filter(task =>
        props.columnTasks.includes(task.id))

    this.state = {
      tasks: setColumnTasks()
    }
  }

  renderTasks = () =>
    this.state.tasks.map((task, index) => (
    <Task key={task.id} task={task} index={index} column={this.props.column}/>
  ))


  render(){
    const {column, onClick} = this.props

    return(
      <Container column={column}>
        <ColumnTitle onClick={()=>onClick(column)}>
          {column.active ? column.id : column.id[0]}
        </ColumnTitle>
        <Droppable droppableId={column.id}>

          {(provided, snapshot) => (

            <div {...provided.droppableProps} ref={provided.innerRef}>
              {column.active ? this.renderTasks() : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Container>
    )
  }
}

export default Column
