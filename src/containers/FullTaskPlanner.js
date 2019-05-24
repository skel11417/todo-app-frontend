import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import PlannerColumn from '../components/PlannerColumn'
// import sampleData from '../sampleData'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  width: 75%;
  border: black solid 1px;
`
const columnIds = ['Today', 'Week', 'Month', 'All']

class TaskPlanner extends React.Component {
  constructor(){
    super()
    this.state = {
      timeframes: {
        'Today': new Date(),
        'Week': new Date(),
        'Month': new Date()
      },
      columns: {
        'Today': [],
        'Week': [],
        'Month': [],
        'All': []
      },
      columnState: {
        'Today': {active: false},
        'Week': {active: false},
        'Month': {active: true},
        'All': {active: true}
      }
    }
  }

  // logs the intended movement in the console
  log = (result) => {
    const {destination, source, draggableId} = result
    console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
  }

  onDragEnd = (result) =>{
    const {destination, source, draggableId} = result
    // only update state if drag destination is valid
    if (!destination){
      return null
    }

    // do not rerender if task has been dragged to its initial
    // location
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return null
    }
    this.log(result)

    if (destination.droppableId !== source.droppableId){
      console.log('is this even firing?')
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.tasks !== this.props.tasks){
      this.loadTasks()
    }
  }

  componentDidMount(){
    this.loadTasks()
  }

  loadTasks =() =>{
    const newColumns={...this.state.columns}
    columnIds.forEach(columnId => {
      newColumns[columnId] = this.filterTasks(this.state.timeframes[columnId])
    })
    this.setState({
      columns: newColumns
    })
  }

  filterTasks = (date) => {
    // need a way to account for week/month being the same date as today
    let filteredTasks
    if (date){
      filteredTasks = []
      date.setHours(0,0,0,0)
      this.props.tasks.forEach(task => {
        if (task.scheduled_date ){
          let dbDate = new Date(task.scheduled_date)
          dbDate.setHours(0,0,0,0)
          if (dbDate - date === 0){
            filteredTasks.push(task)
          }
        }
      })
    } else {
      filteredTasks = this.props.tasks.filter(task => task.scheduled_date === null)
    }
    console.log(filteredTasks)
    return filteredTasks
  }
  // sets selected column and its neighbor's visibility
  // to true and returns
  updateColumnVisibility = (column) => {

    let newIndex = columnIds.indexOf(column)
    const activeArray = [false, false, false, false]
    switch (newIndex) {
      case 0:
      case 1:
        activeArray[0] = true
        activeArray[1] = true
        break
      case 2:
        activeArray[1] = true
        activeArray[2] = true
        break
      case 3:
        activeArray[2] = true
        activeArray[3] = true
        break
      default:
        break
    }
  }

  changeTimeframe = (column) => {
    //rewrite this logic
    let updatedColumns = this.updateColumnVisibility(column)
    if (this.state.columns !== updatedColumns){
      this.setState({
        columns: updatedColumns
      })
    }
  }


  render(){
    return (
      <Container className="TaskPlanner">
        <DragDropContext id="id"
        onDragEnd={this.onDragEnd}
        >
          {columnIds.map((columnId, index) =>(
            <PlannerColumn
              key={columnId}
              index={index}
              active={this.state.columnState[columnId].active}
              columnId={columnId}
              updateTask={this.props.updateTask}
              columnTasks={this.state.columns[columnId]}
              onClickButton={this.changeTimeframe}
            />
            )
          )}
        </DragDropContext>
      </Container>
    );}
}

export default TaskPlanner;
