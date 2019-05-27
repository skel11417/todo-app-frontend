import React, {Component} from 'react'
import PlannerTask from '../components/PlannerTask'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  max-width: auto;
  width: 50%;
  transition:width 0.5s ease-in-out;
  width: ${props => props.active ? '45%' : '5%'};
  min-height:440px;
  padding: 5px;
  display: flex;
  flex-direction: column;`

const ColumnTitle = styled.button`
  font-size: 1.5em;
`

class PlannerColumn extends Component {
  renderTasks = () => {
    const {columnTasks, columnId} = this.props
    return (
      columnTasks.map((task, index) => {
        return <PlannerTask
          key={`${columnId}-${task.id}`}
          task={task}
          columnId={columnId}
          index={task.timeframe_index ? task.timeframe_index : index }
          active={this.props.active}
          onClickTask={()=>console.log("get additional info")}
          deleteTask={this.props.deleteTask}
          updateTask={this.props.updateTask}
          />
      })
    )
  }

  render(){
    const {active, columnId, onClickButton} = this.props
    return(
    <Container active={active}>
      <ColumnTitle onClick={()=>onClickButton(columnId)}>
        {active ? columnId : columnId[0]}
      </ColumnTitle>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div style={{height: '100%'}} {...provided.droppableProps}
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

export default PlannerColumn
