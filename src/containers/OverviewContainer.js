import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchOverview,
  setOverviewModal
} from '../actions/overview'
import dialog from '../api/dialog'
import ipc from '../api/ipc'
import { Row, Col, Card } from 'antd'
import Loading from '../components/Loading'
import Device from '../components/Devil'
// import Elevator from '../components/Elevator'
import Queue from '../components/Queue'
import OperationModal from '../components/OperationModal'

const Panel = ({ text }) => {
  return (
    <Card style={{ height: '129px', lineHeight: '115px', backgroundColor: '#f0f0f0' }} noHovering className='gradient'>
      <div style={{ textAlign: 'center', fontSize: 24 }}>{text}</div>
    </Card>
  )
}

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchOverview('overview'))
  }
  showModal = () => this.props.dispatch(setOverviewModal({ title: 'Operation Request', visible: true }))
  handleCancel = () => this.props.dispatch(setOverviewModal({ visible: false }))
  handleChange = (value) => this.props.dispatch(setOverviewModal({ value: value, visible: true }))
  handleConfirm = (value) => {
    dialog.showMessageBox('warning', ['Cancel', 'OK'], 'Operation Request', `Confirm card ${value} operation ?`, (confirm) => {
      if (confirm) this.props.dispatch(setOverviewModal({ value: value, visible: false }))
    })
  }
  fieldSelection = (device, value) => {
    console.log('Radio group selection', device, value)
  }
  modeSelection = (device, value) => {
    console.log('Radio group selection', device, value)
    ipc.send('mode-change', { device: device, value: value })
  }
  render () {
    const {
      isFetching,
      devices,
      operationModal
    } = this.props
    return (
      <div className='content'>
        {
          isFetching ? <Loading tip='Loading' /> : (
            <div>
              <Row type='flex' justify='center' align='top' gutter={16}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Panel text={'SW'} />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Device
                    device={devices.devices[3]}
                    onChangeRadio={(e) => this.fieldSelection(3, e)}
                    showModal={this.showModal}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Panel text={'NW'} />
                </Col>
              </Row>
              <Row type='flex' justify='center' align='middle' gutter={16}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Device
                    device={devices.devices[0]}
                    onChangeRadio={(e) => this.modeSelection(1, e)}
                    showModal={this.showModal}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Queue
                    exitQueue={devices.exitQueue}
                    showModal={this.showModal}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Device
                    device={devices.devices[1]}
                    onChangeRadio={(e) => this.modeSelection(2, e)}
                    showModal={this.showModal}
                  />
                </Col>
              </Row>
              <Row type='flex' justify='center' align='bottom' gutter={16}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Panel text={'SE'} />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Device
                    device={devices.devices[2]}
                    onChangeRadio={(e) => this.fieldSelection(4, e)}
                    showModal={this.showModal}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <Panel text={'NE'} />
                </Col>
              </Row>
              <OperationModal
                data={operationModal}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onOk={this.handleConfirm}
              />
            </div>
          )
        }
      </div>
    )
  }
}

App.propTypes = {
  isFetching: PropTypes.bool,
  lastUpdated: PropTypes.number,
  devices: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  const { overview } = state
  const {
    isFetching,
    lastUpdated,
    data: devices,
    operationModal
  } = overview
  return {
    isFetching,
    lastUpdated,
    devices,
    operationModal
  }
}

export default connect(mapStateToProps)(App)
