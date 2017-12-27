import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchRack
} from '../actions/rack'
/**
 * Components.
 */
import { Tabs } from 'antd'
import Loading from '../components/Loading'
import Rack from '../components/Rack'
/**
 * Styles.
 */
import '../styles/Rack.css'

const TabPane = Tabs.TabPane

class App extends Component {
  // constructor (props) {
  //   super(props)
  // }
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchRack('rack', 'rack'))
  }
  render () {
    const {
      isFetching,
      racks,
      lastUpdated
    } = this.props
    const tabPanels = []
    racks.forEach((rack, i) => {
      tabPanels.push(
        <TabPane tab={rack.title} key={i} style={{ height: 388 }}>
          <Rack rack={rack} />
        </TabPane>
      )
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
          isFetching ? <Loading tip='Loading' /> : (
            <Tabs defaultActiveKey='0' tabPosition='left' style={{ height: '100%' }}>
              {tabPanels}
            </Tabs>
          )
        }
      </div>
    )
  }
}

App.propTypes = {
  isFetching: PropTypes.bool,
  lastUpdated: PropTypes.number,
  racks: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  const { rack } = state
  const {
    isFetching,
    lastUpdated,
    racks
  } = rack
  return {
    isFetching,
    lastUpdated,
    racks
  }
}

export default connect(mapStateToProps)(App)
