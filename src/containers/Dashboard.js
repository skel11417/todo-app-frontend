import React, {Component} from 'react'
import moment from 'moment'
import { Progress } from 'semantic-ui-react'
import styled from 'styled-components'
import nlp from 'compromise'

const DashContainer = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 50px;
  width: 50%;
`

class Dashboard extends Component {

  render(){
    const {tasks} = this.props
    const today = moment().format("dddd, MMMM D")
    let yesterday = moment().subtract(1, 'days').startOf('day').format()
    let yesterdayScheduledTasks = tasks.filter(task => moment(task.scheduled_date).startOf('day').format() === yesterday)
    tasks.forEach(task => console.log(task.content, task.scheduled_date))
    let yesterdayCompletedTasks = yesterdayScheduledTasks.filter(task => task.completed === true)

    let yesterdayPercent = (yesterdayCompletedTasks.length / yesterdayScheduledTasks.length * 100)
    let thisMonth = moment().endOf('month').startOf('day').format("MMMM")
    let finalWeek = moment().endOf('month').endOf('week').startOf('day').format()
    let totalTasks = tasks.filter(task => moment(task.scheduled_date).format("MMMM") === thisMonth || moment(task.scheduled_date).format() === finalWeek)
    let uncompletedTasks = tasks.filter(task => task.completed === false)
    let completedTasks = totalTasks.filter(task => task.completed === true)

    let monthlyPercent = (completedTasks.length / totalTasks.length * 100)

    return <DashContainer>
    <h1>{today}</h1>

    <p>Yesterday you completed {yesterdayCompletedTasks.length} task{yesterdayCompletedTasks.length === 1 ? '' : 's'} out of the {yesterdayScheduledTasks.length} task{yesterdayScheduledTasks.length === 1 ? '' : 's'} you planned.</p>
    <Progress percent={yesterdayPercent} indicating/>
    <p>{yesterdayCompletedTasks.map(task=> {
      let content = task.content
      let doc = nlp('You '+ content)
      return doc.sentences().toPastTense().out('text') + '. '
    })}</p>
    <br/>
      You've completed {completedTasks.length} task{completedTasks.length === 1 ? '' : 's'} out of {totalTasks.length} task{completedTasks.length === 1 ? '' : 's'} you planned to work on this month.
      <Progress percent={monthlyPercent} indicating />
      <br/>
      You have {`${uncompletedTasks.length} remaining task${uncompletedTasks.length === 1 ? '': 's'}:`}
      <ol>
      {uncompletedTasks.map(task => (<li key={task.id}>{task.content}</li>))}
      </ol>
    </DashContainer>
  }
}
export default Dashboard
