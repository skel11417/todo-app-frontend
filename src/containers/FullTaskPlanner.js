import React from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import PlannerColumn from '../components/PlannerColumn'
import {Button, Grid} from 'semantic-ui-react'
import moment from 'moment'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  width: 75%;
  height: 700px;
  background-color: #f7f7f7;
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

      // this is just something for demo purposes
      if (newTimeframeId === 'Today' && this.state.columns['Today'].length > 2) {
        console.log(this.state.timeframes['Today'])
        let content = newTaskColumns[oldTimeframeId][oldIndex].content
        alert(`Are you sure you want to ${content} today? You've already added ${this.state.columns['Today'].length} tasks`)
      }

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

  componentDidUpdate(prevProps, prevState){
    if (prevProps.tasks !== this.props.tasks){
      this.loadTasks()
    }
    if (prevState.timeframes !== this.state.timeframes){
      this.loadTasks()
    }
  }

  componentDidMount(){
    this.loadTasks()
  }

  loadTasks =() =>{
    if (this.props.tasks.length > 0){
      let newColumns = this.filterTasks()

      if (newColumns["Today"].length === 0 && newColumns["Week"].length === 0 && newColumns["Month"].length === 0){
        this.toggleVisibleColumns("All")
      }

      this.setState({
        columns: newColumns
      })

    }
  }

  filterTasks = () => {
    const taskPool = [...this.props.tasks]
    const timeframes = ['Today', 'Week', 'Month']
    const filteredColumns = {
      'Today': [],
      'Week': [],
      'Month': [],
      'All': []
    }

    // filter tasks in columns with a scheduled date
    timeframes.forEach(timeframe=> {
      for (let i = 0; i < taskPool.length; i++){
        let scheduledDate = moment(taskPool[i].scheduled_date)
        .startOf('day').format()
        if (scheduledDate === this.state.timeframes[timeframe]){
          filteredColumns[timeframe].push(taskPool.splice(i, 1)[0])
          i--
        }
      }

      // place completed tasks at the bottom of Today's task list
      if (timeframe === 'Today') {
        filteredColumns[timeframe].sort((a, b) => a.completed - b.completed)
      }

      // Add incomplete but scheduled tasks to top of Week column
      if (timeframe === 'Week') {
        for (let i = 0; i < taskPool.length; i++){
          if (taskPool[i].completed === false && taskPool[i].scheduled_date < this.state.timeframes['Today']){
            filteredColumns[timeframe].unshift(taskPool.splice(i, 1)[0])
            i--
          }
        }
      }

      // renumber indexes of all tasks in a column
      filteredColumns[timeframe].forEach((task, index)=>{
        task.timeframe_index = index
      }
    )
    })

    // set all unassigned tasks to 'All' column
    filteredColumns['All'] = taskPool.filter(task => task.completed === false)
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

  setNextMonth = () => {
    let newTimeframes = {...this.state.timeframes}
    let currentMonth = this.state.timeframes["Month"]
    newTimeframes["Month"] = moment(currentMonth).add(1, 'months').endOf('month').startOf('day')
    .format()
    newTimeframes["Week"] = moment(currentMonth).add(1, 'weeks').endOf('week').startOf('day').format()
    this.toggleVisibleColumns("All")
    this.setState({
      timeframes: newTimeframes
    })

    let newColumns = this.filterTasks()

    this.setState({
      columns: newColumns
    })
  }
  setPrevMonth = () => {
    let newTimeframes = {...this.state.timeframes}
    let currentMonth = this.state.timeframes["Month"]
    newTimeframes["Month"] = moment(currentMonth).subtract(1, 'months').endOf('month').startOf('day')
    .format()
    newTimeframes["Week"] = moment(currentMonth).subtract(2, 'months').endOf('week').startOf('day').format()
    this.toggleVisibleColumns("All")
    this.setState({
      timeframes: newTimeframes
    })

    let newColumns = this.filterTasks()

    this.setState({
      columns: newColumns
    })
  }

  render(){
    let today = this.state.timeframes.today
    let week = this.state.timeframes.Week
    let month = this.state.timeframes.Month

    const hidePrevButton = () => {
      if (month === moment().endOf('month').startOf('day').format()){
        return {display: 'none'}
      } else {
        return null
      }
    }

    const columnNames = {
      "Today": moment(today).format('dddd'),
      "Week": `${moment(week).startOf('week').format("MMM D")}-${moment(week).endOf('week').format("MMM D")}`,
      "Month": moment(month).format('MMMM'),
      "All": "All Tasks"
    }
    return (
      <div>
        <div style={{padding: '5px', width: '75%', margin: 'auto'}}>
        <Grid columns={3}>
          <Grid.Row textAlign='center'>
            <Grid.Column>
              <Button style={hidePrevButton()} button='small' onClick={this.setPrevMonth}
            content="Previous month"/>
            </Grid.Column>
            <Grid.Column>
              <h1>Daily Planner</h1>
            </Grid.Column>
            <Grid.Column>
            <Button onClick={this.setNextMonth}
            content="Next month"/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>
        <Container className="TaskPlanner">
          <DragDropContext
          onDragEnd={this.onDragEnd}
          >
            {columnIds.map((columnId, index) =>(
              <PlannerColumn
                key={columnId}
                index={index}
                active={this.state.activeColumns[columnId]}
                columnId={columnId}
                columnName={columnNames[columnId]}
                updateTask={this.props.updateTask}
                deleteTask={this.props.deleteTask}
                columnTasks={this.state.columns[columnId]}
                onClickButton={this.toggleVisibleColumns}
              />
              )
            )}
          </DragDropContext>
        </Container>
      </div>
    );}
}

export default TaskPlanner;
