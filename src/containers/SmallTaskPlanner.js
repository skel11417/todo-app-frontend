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
    // if (this.props.tasks.length > 0){
      newColumns["Today"] = this.filterTasks()
      this.setState({
        columns: newColumns
      })
    // }
  }

  filterTasks = () => {
    const taskPool = [...this.props.tasks]
    const {today} = this.state
    const filteredColumns = taskPool.filter(task =>
         moment(task.scheduled_date).startOf('day').format() === today
    )

    filteredColumns.sort((a, b) => a.completed - b.completed)

    filteredColumns.forEach((task, index)=>{
      task.timeframe_index = index
      }
    )

    return filteredColumns
  }

  renderColumn = () => {
    const columnId = "Today"
    const columnName = moment().format('dddd')
    if (this.props.tasks.length > 0){
      return<StaticColumn
            key={columnId}
            index={0}
            active={true}
            columnId={columnId}
            columnName={columnName}
            columnTasks={this.state.columns[columnId]}
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
