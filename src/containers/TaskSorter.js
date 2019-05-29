import React, {Component} from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import CategoryColumn from '../components/CategoryColumn'
import {Modal, Button, Transition} from 'semantic-ui-react'
import styled from 'styled-components'

const CategoriesContainer = styled.div`
  display: flex;
  margin: auto;
  margin-top: 50px;
  height: auto;
  width: 80%;
  background-color: white;
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
    if (prevProps.tasks !== this.props.tasks){
      if (this.props.tasks.some(task => task.category === null)){
        this.setState({
          currentTask: this.props.tasks.find(task => task.category === null),
          open: true
        })
      } else {
        this.setState({
          open: false
          }
        )
      }
      this.setState({
        taskCategories: {
          'A': this.filterTasks('A'),
          'B': this.filterTasks('B'),
          'C': this.filterTasks('C')
        }
      })
    }
  }

  componentDidMount(){
    if (this.props.tasks.length > 0){
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

  // log = (result) => {
  //   const {destination, source, draggableId} = result
  //   if (destination !== null){
  //     console.log('moving task', draggableId, 'from', source.droppableId, 'index', source.index, "to", destination.droppableId, 'index', destination.index )
  //   }
  // }

  onDragEnd = (result) => {
    const {destination, source} = result

    if (!destination){
      return null
    }

    // do not rerender if task has been dragged to its initial
    // location
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return null
    }
    // this.log(result)

    // change category of task
    if (destination.droppableId !== source.droppableId){
      const oldCategoryId = source.droppableId
      const oldIndex = source.index

      const newCategoryId = destination.droppableId
      const newIndex = destination.index

      // optimistically render state of front end
      const newTaskCategories = {...this.state.taskCategories}

      // This is the reordering method
      const destColumn = newTaskCategories[newCategoryId]
      const updatedTask = newTaskCategories[oldCategoryId]
                            .splice(oldIndex, 1)[0]
      updatedTask.category_index = newIndex
      updatedTask.category = newCategoryId
      destColumn.splice(newIndex, 0, updatedTask)

      newTaskCategories[oldCategoryId].forEach((task, index)=> task.category_index = index)

      newTaskCategories[newCategoryId].forEach((task, index)=> task.category_index = index)

      this.setState({
        taskCategories: newTaskCategories
      })

      this.props.updateCatIndexes({
        updatedTask: updatedTask,
        updatedCategories: {
          [oldCategoryId]: newTaskCategories[oldCategoryId],
          [newCategoryId]: newTaskCategories[newCategoryId]
        }
      })
    }
    // change index of task in category
    if (destination.droppableId === source.droppableId){
      const newTaskCategories = {...this.state.taskCategories}
      const oldIndex = source.index
      const newIndex = destination.index
      const categoryId = destination.droppableId
      const categoryTasks = newTaskCategories[categoryId]
      const movedTask = categoryTasks.splice(oldIndex, 1)[0]
      categoryTasks.splice(newIndex, 0, movedTask)

      categoryTasks.forEach((task, index)=> task.category_index = index)

      this.setState({
        taskCategories: newTaskCategories
      })
      // update indexes in the backend
      // refactor the names to movedTask for clarity's sake
      this.props.updateCatIndexes({
        updatedTask: movedTask,
        updatedCategories: {
          [categoryId]: categoryTasks
        }
      })
    }
  }

  // filter completed tasks and order them by category_index
  filterTasks = (category) => {
    return this.props.tasks.filter(task => task.category === category && task.completed === false).sort((a, b) => a.category_index - b.category_index)
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
  // I may refactor this into the backend logic
  categoryMap = ["High", "Medium", "Low"]

  categoryColors = {
    'A': 'red',
    'B': `purple`,
    'C': `blue`
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
      <Transition visible={this.state.open} animation='scale' duration={1000}>
      <Modal
        open={this.state.open}
        size='tiny'
        dimmer='blurring'
        closeIcon
      >
        <Modal.Header>
        <h2>{this.state.currentTask ? this.state.currentTask.content : "loading"}
        </h2>
        </Modal.Header>
        <Modal.Content>
          <h3>What is the priority of this task?</h3>
          {categories.map((category, index)=>(
            <Button
              key={`${category}-button`}
              size="massive"
              color={this.categoryColors[category]}
              onClick={()=>this.setCategory(category)}
            >
            {this.categoryMap[index]}
            </Button>
          ))}
        </Modal.Content>
        <Modal.Actions>
          <Button color="orange" onClick={()=>this.props.deleteTask(this.state.currentTask.id)}>
          Delete Task
          </Button>
          <Button onClick={this.closeModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
      </Transition>
    )
  }

  render(){
    return (
      <div>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <CategoriesContainer>
          {categories.map((category, index) => (
            <CategoryColumn
              key={`${category}-column`}
              columnId={category}
              color={this.categoryColors[category]}
              categoryName={this.categoryMap[index]}
              columnTasks={this.state.taskCategories[category]}
              updateTask={this.props.updateTask}
              deleteTask={this.props.deleteTask}
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
