import React, {Component} from 'react'
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
class Nav extends Component {
  state= {
    activeItem: 'home'
  }

  handleClick = (e, {name}) => {
    this.setState({activeItem: name})
  }

  handleItemClick = (e, {name}) => {
    if (name === 'logout'){
      console.log('attempting to log out')
    }
  }

  render() {
    const {activeItem} = this.state
    return (
      <div>
        <Menu pointing secondary style={{paddingTop: "25px"}}>
          <Menu.Item
          name="home" active={activeItem === 'home'}
          as={Link} exact='true' to="/home"
          onClick={this.handleClick}
          />
          <Menu.Item
          name="mindSweeper" active={activeItem === 'mindSweeper'}
          as={Link} exact='true' to="/brainstorm"
          onClick={this.handleClick}
          />
          <Menu.Item
          name="Planner" active={activeItem === 'Planner'}
          as={Link} exact='true' to="/planner"
          onClick={this.handleClick}
          />
        <Menu.Menu position='right'>
           <Menu.Item
             name='logout'
             active={activeItem === 'logout'}
             onClick={this.handleItemClick}
           />
         </Menu.Menu>
        </Menu>
      </div>

    )
  }

}

export default Nav;
