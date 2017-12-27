import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  fetchNavbarData
} from '../actions/ui'
import { Layout, Avatar, Badge, Tag, Tooltip } from 'antd'
import PageHeader from '../components/Header'
import Blink from '../components/Blink'
// import message from '../api/message'
import notification from '../api/notification'

const { Header } = Layout

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchNavbarData())
  }
  componentWillReceiveProps (nextProps) {
    const { log } = this.props.navbar
    const {
      log: nextLog
    } = nextProps.navbar
    // console.log(log.receivedAt, nextLog.receivedAt, log.receivedAt !== nextLog.receivedAt, nextLog)
    // if (log.receivedAt !== nextLog.receivedAt && log.message !== undefined) message.emit(nextLog.message.type, nextLog.message.html)
    if (log.receivedAt !== nextLog.receivedAt && nextLog.message !== undefined) notification.emit(nextLog.message)
  }
  render () {
    const { navbar } = this.props
    const {
      comm,
      diag
    } = navbar
    // comm
    const commStatus = comm.isOnline ? <Tag color='#87d068'>ONLINE</Tag> : <Tag color='#f50'>OFFLINE</Tag>
    const commInfo = comm.isOnline ? <span>PLC {comm.ip} ONLINE</span> : <span>PLC OFFLINE</span>
    // diag
    const diagStatus = diag.isActive ? <Blink><Tag color='#f50'>ALARM</Tag></Blink> : <span />
    // const diagInfo = diag.isActive ? <span>Active alarms count {diag.alarmCount}</span> : <span>READY</span>
    // let handleClickMenu = e => e.key === 'logout' && console.log('logout')
    return (
      <Header className='header'>
        <PageHeader title={'Parking Manager'} />
        <div />
        <div className='rightWrapper'>
          <div className='navbar-tag'>
            <Badge count={diag.alarmCount}>
              <Avatar shape='square'>EL1</Avatar>
            </Badge>
          </div>
          <div className='navbar-tag'>
            {/* <Tooltip placement='top' title={diagInfo}> */}
            <Link to='/alarms'>
              <Badge count={diag.alarmCount}>
                {diagStatus}
              </Badge>
            </Link>
            {/* </Tooltip> */}
          </div>
          <div className='navbar-tag'>
            <Tooltip placement='top' title={commInfo}>
              <Link to='/diag'>
                {commStatus}
              </Link>
            </Tooltip>
          </div>
          {/*
          <Menu mode='horizontal' onClick={handleClickMenu} >
            <SubMenu
              style={{
                float: 'right'
              }}
              title={<span>
                <Icon type='user' />
                guest
              </span>}
            >
              <Menu.Item key='logout'>
                Sign out
              </Menu.Item>
            </SubMenu>
          </Menu>
          */}
        </div>
      </Header>
    )
  }
}

App.propTypes = {
  navbar: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  const { ui } = state
  const { navbar } = ui
  return {
    navbar
  }
}

export default connect(mapStateToProps)(App)
