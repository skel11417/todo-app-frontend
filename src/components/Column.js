import React, {Component} from 'react'
import Task from '../components/Task'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  max-width: auto;
  width: '25%';
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
    const {tasks, columnId} = this.props
    let columnTasks
    const today = new Date()
    switch (columnId) {
      case "day":
        columnTasks = tasks.filter(task => task.completionDate === today )
        break;
      case "all":
        columnTasks = tasks
        break;
      default:
        break;
    }

    return (
      <div> {columnTasks.toString()}

              </div>
    )
  }
  render(){
    const {active, columnId} = this.props
    return(
    <Container>
      <ColumnTitle>
        {active ? columnId : columnId[0]}
      </ColumnTitle>
      <Droppable droppableId={columnId}>
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
