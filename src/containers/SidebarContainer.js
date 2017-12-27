import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { 
  setMenuActive,
  setNavbarTitle,
  toggleSidebar,
} from '../actions/ui'

import { Layout, Menu, Icon } from 'antd'
// import logo from '../logo.svg'

const { Sider } = Layout
// const SubMenu = Menu.SubMenu

class App extends Component {
  handleItemClick = (e) => {
    this.props.dispatch(setNavbarTitle(e.key))
    this.props.dispatch(setMenuActive(e.key))
  }
  onCollapse = (collapsed) => {
    this.props.dispatch(toggleSidebar(collapsed))
  }
  render () {
    const { activeItem, collapsed } = this.props.sidebar
    return (
      <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          style={{ paddingTop: 0 }}
        >
          <Menu
            theme='dark'
            defaultSelectedKeys={[activeItem]}
            mode='inline'
            onClick={this.handleItemClick}
          >
            {/* <div>
              <img src={logo} className='App-logo' alt='logo' />
            </div> */}
            <Menu.Item key='1' title='System Overview'>
              <Link to='/overview'>
                <Icon type='desktop' />
                <span>System Overview</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='2'>
              <Link to='/map'>
                <Icon type='car' />
                <span>System Map</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='3'>
              <Link to='/cards'>
                <Icon type='user' />
                <span>Cards Management</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='4'>
              <Link to='/rack'>
                <Icon type='database' />
                <span>PLC Digital I / O</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='5'>
              <Link to='/history'>
                <Icon type='file' />
                <span>System Logs</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='6'>
              <Link to='/alarms'>
                <Icon type='notification' />
                <span>System Alarms</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
    )
  }
}

App.propTypes = {
  sidebar: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  const { ui } = state
  const { sidebar } = ui
  return {
    sidebar
  }
}

export default connect(mapStateToProps)(App)
