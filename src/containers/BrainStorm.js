import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form, TextArea, Grid, Modal, Button} from 'semantic-ui-react'
import styled from 'styled-components'

const Container = styled.div`
  width: 75%;
  margin: auto;
`

const Header = styled.div`
  width: 50%;
  margin: auto;
  padding: 50px;
`

class BrainStorm extends Component {

  state = {
    input: "",
    redirect: false,
    open: false,
    currentNewTaskId: null
  }

  handleChange = (event) =>{
    this.setState({input: event.target.value})
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/planner' />
    }
  }

  setCategory = (category) => {
    console.log(category)
  }

  closeModal = () => {
    this.setState({
      open: false
    })
  }

  handleSubmit = () =>{
    // sanitize input
    const newTasks = this.state.input.split(',')
    if (newTasks.length > 0 && newTasks[0] !== ''){
      this.props.batchCreateTasks(newTasks)
      this.setState({input: "", open: true})
    }
  }

  render(){
    return (
      <Container>
        <Header>
          <h1>Life.sort</h1>
        </Header>
        <Form>
          {this.renderRedirect()}
          <TextArea
            onChange={this.handleChange}
            placeholder='list all of your tasks separated by commas'
            value={this.state.input}
            autoFocus
          />
        </Form>
        <Grid centered columns={3}>
          <Grid.Column>
            <Button onClick={this.handleSubmit} size='large'>Create Tasks</Button>
          </Grid.Column>
        </Grid>
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
      </Container>
    )
  }
}
export default BrainStorm
