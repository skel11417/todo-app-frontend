import React, {Component} from 'react'
import {Menu} from 'semantic-ui-react'
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
          onClick={this.handleClick}
        />
          <Menu.Item
          name="mindSweeper" active={activeItem === 'mindSweeper'}
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
