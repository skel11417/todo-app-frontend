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
      activeColumns: {
        'Today': true,
        'Week': true,
        'Month': false,
        'All': false
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
      const oldTimeframeId = source.droppableId
      const oldIndex = source.index

      const newTimeframeId = destination.droppableId
      const newIndex = destination.index

      // optimistically render state of front end
      const newTaskColumns = {...this.state.columns}

      const destColumn = newTaskColumns[newTimeframeId]
      const updatedTask = newTaskColumns[oldTimeframeId]
                            .splice(oldIndex, 1)[0]
      updatedTask.timeframe_index = newIndex

      switch (newTimeframeId) {
        case 'Today':
          updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
          break;
        case 'Week':
          updatedTask.scheduled_date = moment(this.state.timeframes[newTimeframeId])
            .subtract(1, 'second')
          break;
        case 'Month':
          updatedTask.scheduled_date = moment(this.state.timeframes[newTimeframeId])
            .subtract(1, 'second')
          break;
        case 'All':
          updatedTask.scheduled_date = null
          break;
        default:
          break;
      }

      destColumn.splice(newIndex, 0, updatedTask)

      newTaskColumns[oldTimeframeId].forEach((task, index)=> task.timeframe_index = index)

      newTaskColumns[newTimeframeId].forEach((task, index)=> task.timeframe_index = index)

      this.setState({
        columns: newTaskColumns
      })

      this.props.updateTimeIndexes({
        updatedTask: updatedTask,
        updatedTimeframes: {
          [oldTimeframeId]: newTaskColumns[oldTimeframeId],
          [newTimeframeId]: newTaskColumns[newTimeframeId]
        }
      })
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
          } else {
            return false
          }
        })
      }
    return []
  }
  // sets selected column and its neighbor's visibility
  // to true and returns
  updateColumnVisibility = (columnId) => {
    const newColumnState = {
      'Today': false,
      'Week': false,
      'Month': false,
      'All': false
    }
    switch (columnId) {
      case 'Today':
      case 'Week':
        newColumnState['Today'] = true
        newColumnState['Week'] = true
        break
      case 'Month':
        newColumnState['Week'] = true
        newColumnState['Month'] = true
        break
      case 'All':
        newColumnState['Month'] = true
        newColumnState['All'] = true
        break
      default:
        break
    }
    return newColumnState
  }

  toggleVisibleColumns = (columnId) => {
    const newColumnState = this.updateColumnVisibility(columnId)
    if (this.state.activeColumns !== newColumnState){
      this.setState({
        activeColumns: newColumnState
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
              active={this.state.activeColumns[columnId]}
              columnId={columnId}
              updateTask={this.props.updateTask}
              columnTasks={this.state.columns[columnId]}
              onClickButton={this.toggleVisibleColumns}
            />
            )
          )}
        </DragDropContext>
      </Container>
    );}
}

export default TaskPlanner;
