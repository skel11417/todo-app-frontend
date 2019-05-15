import React, {Component} from 'react';
import TaskOrganizer from './TaskOrganizer'
import sampleData from '../sampleData'

class Main extends Component {
  state = sampleData

  render(){
    return (
      <div className="Main">
        <TaskOrganizer/>
      </div>
    );}
}

export default Main;
