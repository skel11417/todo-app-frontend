import React, {Component} from 'react'
import Task from '../components/Task'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  max-width: auto;
  width: 50%;
  transition:width 0.5s ease-in-out;
  min-height:440px;
  padding: 5px;
  display: flex;
  flex-direction: column;`

const ColumnTitle = styled.button`
  font-size: 1.5em;
  /* background-color: ${props=> props.color} */
`

class CategoryColumn extends Component {
  renderTasks = () => {
    const {columnTasks, columnId} = this.props
    return (
      columnTasks.map((task, index)=> {
        return <Task
          key={`${columnId}-${task.id}`}
          task={task}
          columnId={columnId}
          index={index}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          />
      })
    )
  }

  render(){
    const {columnId, color} = this.props
    return(
    <Container>
      <ColumnTitle color={color}>
        <h1>{columnId} Tasks</h1>
      </ColumnTitle>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div style={{minHeight: '500px'}} {...provided.droppableProps}
          ref={provided.innerRef}>
            {this.renderTasks()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Container>
    )
  }
}

export default CategoryColumn
