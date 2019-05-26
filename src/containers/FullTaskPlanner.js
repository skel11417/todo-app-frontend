import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import moment from 'moment'
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
    const today = moment().startOf('day').format()
    const endOfWeek = moment()
                        .endOf('week')
                        .add(1, 'days')
                        .startOf('day')
                        .format()
    const endOfMonth = moment()
                        .endOf('month')
                        .add(1, 'days')
                        .startOf('day')
                        .format()

    this.state = {
      timeframes: {
        'Today': today,
        'Week': endOfWeek,
        'Month': endOfMonth
      },
      columns: {
        'Today': [],
        'Week': [],
        'Month': [],
        'All': []
      },
      columnState: {
        'Today': {active: true},
        'Week': {active: true},
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

    // change schedules timeframe of task
    if (destination.droppableId !== source.droppableId){
      const oldTimeFrameId = source.droppableId
      const oldIndex = source.index

      const newTimeFrameId = destination.droppableId
      const newIndex = destination.index

      // optimistically render state of front end
      const newTaskColumns = {...this.state.columns}

      const destColumn = newTaskColumns[newTimeFrameId]
      const updatedTask = newTaskColumns[oldTimeFrameId]
                            .splice(oldIndex, 1)[0]
      updatedTask.timeframe_index = newIndex

      destColumn.splice(newIndex, 0, updatedTask)

      newTaskColumns[oldTimeFrameId].forEach((task, index)=> task.timeframe_index = index)

      newTaskColumns[newTimeFrameId].forEach((task, index)=> task.timeframe_index = index)

      this.setState({
        columns: newTaskColumns
      })

      // this.props.updateIndexes({
      //   updatedTask: updatedTask,
      //   updatedCategories: {
      //     [oldTimeFrameId]: newTaskColumns[oldTimeFrameId],
      //     [newTimeFrameId]: newTaskColumns[newTimeFrameId]
      //   }
      // })
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
      newColumns[columnId] = this.filterTasks(columnId)
    })
    this.setState({
      columns: newColumns
    })
    // update backendIndexes
    
  }

  filterTasks = (columnId) => {
    // need a way to account for week/month being the same date as today
    if (columnId === 'All') {
      return this.props.tasks.filter(task => task.scheduled_date === null)
    }
    if (columnId === 'Today'){
      let date = this.state.timeframes[columnId]
      return this.props.tasks.filter(task => {
        if (task.scheduled_date){
          let scheduledDate = moment(task.scheduled_date)
          .startOf('day').format()
          return scheduledDate === date
        } else {
          return false
        }
      })
    }
    if (columnId === 'Week') {
        return this.props.tasks.filter(task => {
          if (task.scheduled_date){
            let scheduledDate = moment(task.scheduled_date)
            let monthEnd = moment(this.state.timeframes[columnId])
            // debugger
            // return scheduledDate >= moment(this.)
          } else {
            return false
          }
        })
      }
    return []
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
