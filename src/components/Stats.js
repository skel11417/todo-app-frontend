import React, {Component} from 'react'
import { Progress } from 'semantic-ui-react'
import styled from 'styled-components'
import moment from 'moment'
import nlp from 'compromise'

const Container = styled.div``

class Stats extends Component {
  render(){
    const {tasks} = this.props

    let yesterday = moment().subtract(1, 'days').startOf('day').format()
    let yesterdayScheduledTasks = tasks.filter(task => moment(task.scheduled_date).startOf('day').format() === yesterday)

    let yesterdayCompletedTasks = yesterdayScheduledTasks.filter(task => task.completed === true)

    let yesterdayPercent = (yesterdayCompletedTasks.length / yesterdayScheduledTasks.length * 100)
    let thisMonth = moment().endOf('month').startOf('day').format("MMMM")
    let finalWeek = moment().endOf('month').endOf('week').startOf('day').format()
    let totalTasks = tasks.filter(task => moment(task.scheduled_date).format("MMMM") === thisMonth || moment(task.scheduled_date).format() === finalWeek)
    let completedTasks = totalTasks.filter(task => task.completed === true)

    let monthlyPercent = (completedTasks.length / totalTasks.length * 100)

    return(
      <Container>
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
      </Container>

    )
  }
}
export default Stats
