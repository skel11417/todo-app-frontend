import React, {Component} from 'react'
import SmallTaskPlanner from './SmallTaskPlanner'
import {Container, Grid, Segment} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Stats from '../components/Stats'
import styled from 'styled-components'
import moment from 'moment'

const DashContainer = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin: auto;
  width: 100%;
`

class Dashboard extends Component {

  state = {
    caroSpeech: "Meow may I help you?",
    quoteOfDay: {quote: "",
      author: ""
    }
  }

  componentDidMount(){
    fetch('http://quotes.rest/qod.json?category=inspire')
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          quoteOfDay: json.contents.quotes[0]
        })
      })
  }

  render(){
    const today = moment().format("dddd, MMMM D")

    return (
      <DashContainer>
        <Container style={{height: '100%'}}>
        <h1 style={{textAlign: 'center', padding: '10px'}}>{today}</h1>
          <Grid columns={2} >
            <Grid.Column style={{height: '600px'}}>
              <SmallTaskPlanner
                tasks={this.props.tasks}
                deleteTask={this.props.deleteTask}
                updateTask={this.props.updateTask}
                updateTimeIndexes={this.props.updateTimeIndexes}
              />
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h1>{this.state.quoteOfDay.quote}</h1>
              <p>-- {this.state.quoteOfDay.author}</p>
            </Segment>
            <Segment>
              <Stats tasks={this.props.tasks}/>
            </Segment>

          <Segment>
            <img width='30%' src={process.env.PUBLIC_URL + '/Caro.png'} />
            <img width='50px' src={process.env.PUBLIC_URL + 'speech-bubble-png-4214.png'} />
          </Segment>

          </Grid.Column>
        </Grid>
        </Container>
    </DashContainer>
  )
  }
}
export default Dashboard
