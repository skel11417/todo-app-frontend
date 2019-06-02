import React, {Component} from 'react'
import SmallTaskPlanner from './SmallTaskPlanner'
import {Container, Grid, Segment} from 'semantic-ui-react'
// import {Link} from 'react-router-dom'
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
    caroSpeech: "",
    quoteOfDay: {quote: "",
      author: ""
    }
  }

  componentDidMount(){
    const caroQuotes = ["Don't mind me, I'm just here for moral support", "Meow may I help you?", "If you're running late, just con-cat-enate!", "You've completed 60% of your goals this month."]
    const caroSpeech = caroQuotes[Math.floor(Math.random()*caroQuotes.length)];

    fetch('http://quotes.rest/qod.json?category=inspire')
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          quoteOfDay: json.contents.quotes[0],
          caroSpeech: caroSpeech
        })
      })
  }

  componentDidUpdate(prevProps){
    if (prevProps.tasks !== this.props.tasks){
      console.log("Let's get started with tasks")
    }
  }

  render(){
    const today = moment().format("dddd, MMMM D")
    return (
      <DashContainer>
        <Container style={{height: '100%'}}>
        <h1 style={{textAlign: 'center', padding: '10px'}}>{today}</h1>
          <Grid columns={2} >
          <Grid.Row>
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
              <img width='155px' alt='Caro the crashtest kitten' src={process.env.PUBLIC_URL + '/Caro.png'} />
              <div id="bubble" style={{position: 'relative', top: '-88px', left: '280px', float: 'left'}}>
                <img width='200px' alt='speech bubble' src={process.env.PUBLIC_URL + 'speech-bubble.png'} />
                <div style={{height: '110px', width: '151px', position: 'absolute', textAlign:'center', fontSize:'1.6em', lineHeight: 'normal', fontFamily:'comic-sans', top:'26px', left: '28px', padding: '5px'}}>{this.state.caroSpeech}</div>
              </div>
            </Segment>
            <Segment style={{backgroundColor: '#f7f7f7'}}>
              <Stats tasks={this.props.tasks}/>
            </Segment>
            <Segment style={{backgroundColor: '#f7f7f7'}}>
              <h1>{this.state.quoteOfDay.quote}</h1>
              <p>-- {this.state.quoteOfDay.author}</p>
            </Segment>
          </Grid.Column>
          </Grid.Row>
        </Grid>
        </Container>
    </DashContainer>
  )
  }
}
export default Dashboard
