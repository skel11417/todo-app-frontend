import React, {Component} from 'react';
import { DragDropContext} from "react-beautiful-dnd";
import Column from '../components/Column'
import {Modal, Button} from 'semantic-ui-react'
import sampleData from '../sampleData'
import styled from 'styled-components'

class TaskPriority extends Component {

  state = {
    open: true
  }

  closeModal = () => {
    this.setState({
      open: false
    })
  }

  render(){
    return (
      <Modal
        open={this.state.open}
      >
        <Modal.Header>Task Content</Modal.Header>
        <Modal.Content>
          <p> What kind of task is this? </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeModal}>
              Close
            </Button>
            <Button onClick={this.previousTask}>
            Previous Task
            </Button>
            <Button onClick={()=>this.setCategory("A")}>
            A
            </Button>
            <Button onClick={()=>this.setCategory("B")}>
            B
            </Button>
            <Button onClick={()=>this.setCategory("C")}>
            C
            </Button>
            <Button onClick={this.nextTask}>
              Next Task
            </Button>
          </Modal.Actions>
      </Modal>
  )
  }
}

export default TaskPriority
