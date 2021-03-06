import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form, TextArea, Grid, Button} from 'semantic-ui-react'
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
    redirect: false
  }

  handleChange = (event) =>{
    this.setState({input: event.target.value})
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/sorter' />
    }
  }

  handleSubmit = () =>{
    const {input} = this.state
    if (input !== ''){
      const newTasks = input.split(/\n|,/)
      newTasks.forEach((task, index) => {
        task.trim()
        if (task === ""){
          newTasks.splice(index, 1)
        }
        task.charAt(0).toUpperCase()
      })
      this.props.batchCreateTasks(newTasks)
      this.setState({input: "", redirect: true})
    }
  }

  render(){
    return (
      <Container>
        <Header>
          <h1 style={{fontSize: "4em"}}>MindSweeper</h1>
        </Header>
        <Form>
          {this.renderRedirect()}
          <TextArea
            style={{height: '300px', fontSize: '1.5em', margin: 'auto'}}
            onChange={this.handleChange}
            placeholder='List all of your tasks separated by commas or on separate lines'
            value={this.state.input}
            autoFocus
          />
        </Form>
        <Grid centered columns={3}>
          <Grid.Column>
            <Button
              onClick={this.handleSubmit}
              style={{margin: '5px'}}
              size='massive'
              >
              Create Tasks
            </Button>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}
export default BrainStorm
