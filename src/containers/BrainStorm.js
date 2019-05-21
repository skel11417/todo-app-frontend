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
      return <Redirect to='/planner' />
    }
  }

  handleSubmit = () =>{
    // sanitize input
    const newTasks = this.state.input.split(',')
    if (newTasks.length > 0 && newTasks[0] !== ''){
      this.props.batchCreateTasks(newTasks)
      this.setState({input: "", redirect: true})
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
      </Container>
    )
  }
}
export default BrainStorm
