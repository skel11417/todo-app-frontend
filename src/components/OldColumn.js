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

  renderTasks = () => {
    const {column, allTasks} = this.props
    return column.tasks.map((taskId, index) => {
      const task = allTasks.find( task => task.id === taskId)
      return <Task key={task.id} task={task} allTasks={allTasks} index={index} column={column}/>
  }
  )
}

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
              {this.renderTasks()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Container>
    )
  }
}

export default Column
