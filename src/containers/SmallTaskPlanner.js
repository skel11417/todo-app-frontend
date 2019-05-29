import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import StaticColumn from '../components/StaticColumn'
import moment from 'moment'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  float: left;
  margin: auto;
  width: 100%;
  min-height: 800px;
  background-color: #f7f7f7;
`
const columnIds = ['Today']

class SmallTaskPlanner extends React.Component {
  constructor(){
    super()
    const today = moment().startOf('day').format()

    this.state = {
      columns: {
        'Today': []
      },
      today: today
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
    // if (destination.droppableId !== source.droppableId){
    //   const oldTimeframeId = source.droppableId
    //   const oldIndex = source.index
    //
    //   const newTimeframeId = destination.droppableId
    //   const newIndex = destination.index
    //
    //   // optimistically render state of front end
    //   const newTaskColumns = {...this.state.columns}
    //
    //   // this is just something for demo purposes
    //   if (newTimeframeId === 'Today' && this.state.columns['Today'].length > 5) {
    //     let content = newTaskColumns[oldTimeframeId][oldIndex].content
    //     alert(`Are you sure you want to ${content} today? You usually don't accomplish more than 5 tasks a day and you've already added ${this.state.columns['Today'].length} tasks`)
    //   }
    //
    //   const destColumn = newTaskColumns[newTimeframeId]
    //   const updatedTask = newTaskColumns[oldTimeframeId]
    //                         .splice(oldIndex, 1)[0]
    //
    //   updatedTask.timeframe_index = newIndex
    //
    //   switch (newTimeframeId) {
    //     case 'Today':
    //       updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
    //       break;
    //     case 'Week':
    //       updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
    //       break;
    //     case 'Month':
    //       updatedTask.scheduled_date = this.state.timeframes[newTimeframeId]
    //       break;
    //     case 'All':
    //       updatedTask.scheduled_date = null
    //       break;
    //     default:
    //       break;
    //   }
    //
    //   destColumn.splice(newIndex, 0, updatedTask)
    //
    //   newTaskColumns[oldTimeframeId].forEach((task, index)=> task.timeframe_index = index)
    //
    //   newTaskColumns[newTimeframeId].forEach((task, index)=> task.timeframe_index = index)
    //
    //   this.setState({
    //     columns: newTaskColumns
    //   })
    //
    //   this.props.updateTimeIndexes({
    //     updatedTask: updatedTask,
    //     updatedTimeframes: {
    //       [oldTimeframeId]: newTaskColumns[oldTimeframeId],
    //       [newTimeframeId]: newTaskColumns[newTimeframeId]
    //     }
    //   })
    // }
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
    const newColumns = this.state.columns
    if (this.props.tasks.length > 0){
      newColumns["Today"] = this.filterTasks()
      this.setState({
        columns: newColumns
      })
    }
  }

  filterTasks = () => {
    const taskPool = [...this.props.tasks]
    const filteredColumns = []
    // filter tasks in columns with a scheduled date
      for (let i = 0; i < taskPool.length; i++){

        let scheduledDate = moment(taskPool[i].scheduled_date)
        .startOf('day').format()

        if (scheduledDate === this.state.today){
          filteredColumns.push(taskPool.splice(i, 1)[0])
          i--
        }
      }

      // place completed tasks at the top of Today's task list
        for (let i = 0; i < taskPool.length; i++){
          if (taskPool[i].completed === true && moment(taskPool[i].date_completed).startOf('day').format() === this.state.today){
            filteredColumns.unshift(taskPool.splice(i, 1)[0])
            i--
          }
        }

      // renumber indexes of all tasks in a column
      filteredColumns.forEach((task, index)=>{
        task.timeframe_index = index
      }
    )

    return filteredColumns
  }

  renderColumn = () => {
    let today = moment()
    const columnId = "Today"
    const columnName = moment().format('dddd')
    if (this.props.tasks.length > 0){
      return<StaticColumn
            key={columnId}
            index={0}
            active={true}
            columnId={columnId}
            columnName={columnName}
            columnTasks={this.filterTasks()}
            deleteTask={this.props.deleteTask}
            updateTask={this.props.updateTask}
          />
    } else {
      return null
    }
  }

  render(){

    return (
      <Container className="SmallTaskPlanner">
        <DragDropContext id="id"
        onDragEnd={this.onDragEnd}
        >
        {this.renderColumn()}
        </DragDropContext>
      </Container>
  );}
}

export default SmallTaskPlanner;
