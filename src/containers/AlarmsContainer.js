import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchAlarms } from '../actions/alarms'
import { Alert, Badge, Button, Tabs } from 'antd'
import Loading from '../components/Loading'
import '../styles/Alarms.css'

const Alarm = (props) => {
  const { a } = props
  const clearBtn = a.cancel !== 0 && <Button type='danger' ghost className='alarm-clear-btn' icon='delete' onClick={this.alarmClear}>Clear</Button>
  return (
    <Alert
      className='alarm-alert'
      type='error'
      message={<span>{a.class}&nbsp;{a.label}</span>}
      description={<span>{a.date}&nbsp;{a.info}{clearBtn}</span>}
      showIcon
    />
  )
}

const Ready = (props) => {
  return (
    <Alert
      type='success'
      message={props.label}
      description='System Ready'
      showIcon
    />
  )
}

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    lastUpdated: PropTypes.number
  }
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchAlarms('alarms'))
  }
  alarmClear = () => {
    console.log('clear')
  }
  render () {
    const {
      isFetching,
      lastUpdated,
      alarms
    } = this.props
    const tabEL1 = <Badge count={alarms.groups[0].count}><span style={{ padding: 12 }}>Elevator 1</span></Badge>
    const alarmsEL1 = alarms.groups[0].active.map((a, i) => {
      return <Alarm a={a} key={i} />
    })
    const tabEL2 = <Badge count={alarms.groups[1].count}><span style={{ padding: 12 }}>Elevator 2</span></Badge>
    const alarmsEL2 = alarms.groups[1].active.map((a, i) => {
      return <Alarm a={a} key={i} />
    })
    const tabEL3 = <Badge count={alarms.groups[2].count}><span style={{ padding: 12 }}>Elevator 3</span></Badge>
    const alarmsEL3 = alarms.groups[2].active.map((a, i) => {
      return <Alarm a={a} key={i} />
    })
    const tabEL4 = <Badge count={alarms.groups[3].count}><span style={{ padding: 12 }}>Elevator 4</span></Badge>
    const alarmsEL4 = alarms.groups[3].active.map((a, i) => {
      return <Alarm a={a} key={i} />
    })
    return (
      <div className='content'>
      {lastUpdated &&
        <span className='flex-end'>
          Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
          {' '}
        </span>
      }
      {/* {!isFetching &&
        <a
          onClick={this.handleRefresh}>
          Refresh
        </a>
      } */}
      {
        isFetching
        ?
        <Loading tip='Loading' />
        :
        <Tabs tabPosition='left' tabBarExtraContent='extra' >
          <Tabs.TabPane tab={tabEL1} key='1'>{alarmsEL1.length > 0 ? alarmsEL1 : <Ready label='Elevator 1' />}</Tabs.TabPane>
          <Tabs.TabPane tab={tabEL2} key='2'>{alarmsEL2.length > 0 ? alarmsEL2 : <Ready label='Elevator 2' />}</Tabs.TabPane>
          <Tabs.TabPane tab={tabEL3} key='3'>{alarmsEL3.length > 0 ? alarmsEL3 : <Ready label='Elevator 3' />}</Tabs.TabPane>
          <Tabs.TabPane tab={tabEL4} key='4'>{alarmsEL4.length > 0 ? alarmsEL4 : <Ready label='Elevator 4' />}</Tabs.TabPane>
        </Tabs>
      }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { alarms } = state
  return alarms
}

export default connect(mapStateToProps)(App)
