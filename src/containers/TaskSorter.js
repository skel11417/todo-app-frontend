import React, {Component} from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import CategoryColumn from '../components/CategoryColumn'
import {Modal, Button} from 'semantic-ui-react'
import styled from 'styled-components'

const CategoriesContainer = styled.div`
  display: flex;
  margin: auto;
  margin-top: 50px;
  height: auto;
  width: 80%;
  border: black solid 1px;
`

// Categories
const categories = ["A","B","C"]

class TaskSorter extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      currentTask: null,
      taskCategories: {
        'A': [],
        'B': [],
        'C': [],
      }
    }
  }

  componentDidUpdate(prevProps){
    // check if currentTask has changed
    if (prevProps.tasks !== this.props.tasks){
      if (this.props.tasks.some(task => task.category === null)){
        this.setState({
          currentTask: this.props.tasks.find(task => task.category === null),
          open: true,

        })
      } else {
        this.setState({
          open: false,
          taskCategories: {
            'A': this.filterTasks('A'),
            'B': this.filterTasks('B'),
            'C': this.filterTasks('C'),
          }
        })
      }
    }
  }

  log = (result) => {
    const {destination, source, draggableId} = result
    if (destination !== null){
      console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
    }
  }

  onDragEnd = (result) => {
    const {destination, source, draggableId} = result

    if (!destination){
      return null
    }

    // do not rerender if task has been dragged to its initial
    // location
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return null
    }
    this.log(result)

    // change category of task
    if (destination.droppableId !== source.droppableId){
      // get id of task and new category
      const taskId = parseInt(draggableId.split("-")[1])
      const category = destination.droppableId
      const catIndex = destination.index
      this.props.updateTask({
        id: taskId,
        category: category,
        category_index: catIndex
      })
    }
    // optimistically render state of front end
    let newTaskCategories = {...this.state.taskCategories}
    this.setState({
      taskCategories: newTaskCategories

    })
  }

  filterTasks = (category) => {
    return this.props.tasks.filter(task => task.category === category).sort((a, b) => a.category_index - b.category_index)
  }

  openModal = (taskId) => {
    this.setState({
      currentTask: this.findTaskById(taskId),
      open: true
    })
  }

  closeModal = () => {
    this.setState({
      open: false
    })
  }

  findTaskById = (taskId) => {
    return this.props.tasks.find(task => task.id === taskId)
  }

  setCategory = (category) => {
    this.props.updateTask({
      id: this.state.currentTask.id,
      category: category
    })
  }

  renderModal = () => {

    return (
      <Modal
        open={this.state.open}
        size='tiny'
        dimmer='blurring'
      >
        <Modal.Header>{this.state.currentTask ? this.state.currentTask.content : "loading"}</Modal.Header>
        <Modal.Content>
          <p>What kind of task is this?</p>
          {categories.map(category=>(
            <Button
              key={`${category}-button`}
              onClick={()=>this.setCategory(category)}
            >
            {category}
            </Button>
          ))}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.closeModal}>
            Close
          </Button>
          <Button onClick={this.previousTask}>
            Previous Task
          </Button>
          <Button onClick={this.nextTask}>
            Next Task
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render(){
    return (
      <div>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <CategoriesContainer>
          {categories.map(category => (
            <CategoryColumn
              key={`${category}-column`}
              columnId={category}
              columnTasks={this.state.taskCategories[category]}
              updateTask={this.props.updateTask}
              deleteTask={this.props.deleteTask}
              openModal={this.openModal}
            />
          ))}
        </CategoriesContainer>
        <div style={{display: 'flexbox', margin: 'auto', width: '80%'}}>
          {this.filterTasks(null).map(task => (<Button style={{display: 'inline', padding: '10px', margin: '10px'}} key={task.id} onClick={()=>this.openModal(task.id)}>
          {task.content}
          </Button>))}
        </div>
        </DragDropContext>
        {this.renderModal()}
      </div>
  )
  }
}

export default TaskSorter
