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

  getPathname = () => {
    const path = this.props.history.location.pathname

    return path === '/' ? 'home' : path
  }

  render() {
    const activeItem = this.getPathname()
    return (
      <div style={{backgroundColor: '#b1b5be'}}>
        <Menu pointing secondary style={{paddingTop: "25px"}}>
          <Menu.Item
          name="home" active={activeItem === 'home'}
          as={Link} exact='true' to="/"
          onClick={this.handleClick}
          />
          <Menu.Item
          name="/mindsweeper" active={activeItem === '/mindsweeper'}
          as={Link} exact='true' to="/mindsweeper"
          onClick={this.handleClick}
          />
          <Menu.Item
          name="/sorter" active={activeItem === "/sorter"}
          as={Link} exact='true' to="/sorter"
          onClick={this.handleClick}
          />
          <Menu.Item
          name="/planner" active={activeItem === '/planner'}
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
