import React, {Component} from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import Column from '../components/Column'
import Task from '../components/Task'
import {Modal, Button} from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: auto;
  margin-top: 50px;
  height: auto;
  width: 80%;
  border: black solid 1px;
`

class TaskPriority extends Component {

  state = {
    open: false,
    currentTask: null,
  }

  componentDidUpdate(prevProps){
    if (prevProps.tasks !== this.props.tasks){
      if (this.props.tasks.some(task => task.category === null)){
        this.setState({
          currentTask: this.props.tasks.filter(task => task.category === null)[0],
          open: true
        })
      }
    }
  }

  renderCategoryTasks = (category) => {
    return this.filterTasks(category).map((task, index) => {
      return <div onClick={() => this.openModal(task.id)} key={task.id}>{task.content}</div>
    })
  }

  filterTasks = (category) => {
    if (this.props.tasks.length > 0){
      return this.props.tasks.filter(task => task.category === category)
    }
    return this.props.tasks
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
        <Button onClick={()=>this.setCategory("A")}>
        A
        </Button>
        <Button onClick={()=>this.setCategory("B")}>
        B
        </Button>
        <Button onClick={()=>this.setCategory("C")}>
        C
        </Button>
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
    const {tasks} = this.props
    let filteredTasks = this.filterTasks(null)
    return (
      <div>
        <Container>
          <div style={{width: '33%',border: 'black solid 1-x'}}>
            <h1>A</h1>
            {this.renderCategoryTasks("A")}
          </div>
          <div style={{width: '33%', border: 'black solid 1px'}}>
            <h1>B</h1>
            {this.renderCategoryTasks("B")}
          </div>
          <div style={{width: '33%', border: 'black solid 1px'}}>
            <h1>C</h1>
            {this.renderCategoryTasks("C")}
          </div>
        </Container>
        <div style={{display: 'flexbox', margin: 'auto', width: '80%'}}>
          {filteredTasks.map(task => (<Button style={{display: 'inline', padding: '10px', margin: '10px'}} key={task.id} onClick={()=>this.openModal(task.id)}>{task.content}</Button>))}
        </div>
        {this.renderModal()}
      </div>
  )
  }
}

export default TaskPriority
