import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import PlannerColumn from '../components/PlannerColumn'
import moment from 'moment'
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
                        .startOf('day')
                        .format()
    const endOfMonth = moment()
                        .endOf('month')
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
        'Month': true,
        'All': true
      }
    }
  }

  // logs the intended movement in the console
  log = (result) => {
    const {destination, source, draggableId} = result
    console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
  }

  onDragEnd = (result) =>{
    const {destination, source} = result
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

    // change scheduled timeframe of task
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
          updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
          break;
        case 'Month':
          updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
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
    // reorder tasks within column
    if (destination.droppableId === source.droppableId){
      const oldIndex = source.index

      const columnId = destination.droppableId
      const newIndex = destination.index

      // optimistically render state of front end
      const newTaskColumns = {...this.state.columns}

      const destColumn = newTaskColumns[columnId]
      const updatedTask = destColumn
                            .splice(oldIndex, 1)[0]
      updatedTask.timeframe_index = newIndex
      destColumn.splice(newIndex, 0, updatedTask)
      destColumn.forEach((task, index)=> task.timeframe_index = index)
      this.setState({
        columns: newTaskColumns
      })

      this.props.updateTimeIndexes({
        updatedTask: updatedTask,
        updatedTimeframes: {
          [columnId]: destColumn
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
    if (this.props.tasks.length > 0){
      let newColumns= this.filterTasks()
      this.setState({
        columns: newColumns
      })
    }
  }

  filterTasks = () => {
    let taskPool = [...this.props.tasks]
    const filteredColumns = {
      'Today': [],
      'Week': [],
      'Month': [],
      'All': []
    }
    let timeframes = ['Today', 'Week', 'Month']
    timeframes.forEach(timeframe=> {
      for (let i = 0; i < taskPool.length; i++){
        let scheduledDate = moment(taskPool[i].scheduled_date)
        .startOf('day').format()
        if (scheduledDate === this.state.timeframes[timeframe]){
          filteredColumns[timeframe].push(taskPool.splice(i, 1)[0])
          i--
        }
      }
      filteredColumns[timeframe].forEach((task, index)=>{
        task.timeframe_index = index
      }
    )
    })

    // set all unassigned tasks to 'All' column
    filteredColumns['All'] = [...taskPool]
    filteredColumns['All'].forEach((task, index)=>{
      task.timeframe_index = index
      }
    )
    return filteredColumns
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
              deleteTask={this.props.deleteTask}
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
