import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  fetchMap,
  setEditModal,
  setVisibilityFilter
} from '../actions/map'
import { Row, Col, Radio } from 'antd'
import Loading from '../components/Loading'
import Level from '../components/Map'
import Edit from '../components/MapEdit'
import Occupancy from '../components/MapOccupancy'
import '../styles/Map.css'

const RadioGroup = Radio.Group

class App extends Component {
  constructor (props) {
    super(props)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchMap('map', { map: 'map' }))
  }
  onChange = (e) => {
    // console.log('radio checked', e.target.value)
    this.props.dispatch(setVisibilityFilter(e.target.value))
  }
  render () {
    const {
      isFetching,
      lastUpdated,
      mappa,
      visibilityFilter,
      editModal
    } = this.props
    const levels = []
    this.props.mappa.levels.forEach((level, i) => {
      levels.push(
        <Level
          level={level}
          key={i}
          side={'n'}
          openModal={this.showModal}
        />
      )
    })
    const occupancy = mappa.statistics[0]
    return (
      <div className='content'>
        {
          isFetching ? <Loading tip='Loading' /> : (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[0]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[1]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[2]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[3]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[4]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[5]}</Col>
              </Row>
              <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[6]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[7]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[8]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[9]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[10]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[11]}</Col>
              </Row>
              <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[12]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[13]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[14]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[15]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[16]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[17]}</Col>
              </Row>
              <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[18]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[19]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[20]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[21]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[22]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[23]}</Col>
              </Row>
              <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[24]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>{levels[25]}</Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}></Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}></Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}></Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}></Col>
              </Row>
              {/* <Map
                map={mappa}
                side={'n'}
                openModal={this.showModal}
              /> */}
              <RadioGroup onChange={this.onChange} value={visibilityFilter}>
                <Radio value={'SHOW_NUMBERS'}>
                  Numbers
                </Radio>
                <Radio value={'SHOW_CARDS'}>
                  Cards
                </Radio>
                <Radio value={'SHOW_SIZES'} disabled>
                  Sizes
                </Radio>
              </RadioGroup>
            </div>
            <div>
              <h3>Map Occupancy</h3>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '6px', margin: '16px 0', padding: '16px' }}>
                <Occupancy data={occupancy} />
              </div>
            </div>
          </div>
          )
        }
        <Edit
          data={editModal}
          onCancel={this.handleCancel}
          onChange={this.handleChange}
          onConfirm={this.handleOk}
        />
      </div>
    )
  }
  showModal = (stall, card) => {
    // console.log('showModal', stall, card)
    this.props.dispatch(setEditModal({ stall: stall, value: card, visible: true, write: false }))
  }
  handleCancel = (e) => {
    // console.log('handleCancel', e)
    this.props.dispatch(setEditModal({ stall: 0, value: 0, visible: false, write: false }))
  }
  handleChange = (stall, card) => {
    // console.log('handleChange', stall, card)
    this.props.dispatch(setEditModal({ stall: stall, value: card, visible: true, write: false }))
  }
  handleOk = (stall, card) => {
    console.log('handleOk', stall, card)
    this.props.dispatch(setEditModal({ stall: stall, value: card, visible: false, write: true }))
  }
}

App.propTypes = {
  isFetching: PropTypes.bool,
  lastUpdated: PropTypes.number,
  visibilityFilter: PropTypes.string.isRequired,
  mappa: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function stallLabel (map, filter) {
  switch (filter) {
    case 'SHOW_NUMBERS':
      map.levels.forEach(l => {
        l.stalls.forEach(s => { s.label = s.nr })
        return l
      })
      return map
    case 'SHOW_CARDS':
      map.levels.forEach(l => {
        l.stalls.forEach(s => { s.label = s.card })
        return l
      })
      return map
    case 'SHOW_SIZES':
      map.levels.forEach(l => {
        l.stalls.forEach(s => { s.label = s.size })
        return l
      })
      return map
    default:
      return map
  }
}

function mapStateToProps (state) {
  const { map } = state
  const {
    isFetching,
    lastUpdated,
    visibilityFilter,
    map: mappa,
    editModal
  } = map
  return {
    isFetching,
    lastUpdated,
    visibilityFilter,
    mappa: stallLabel(mappa, visibilityFilter),
    editModal
  }
}

export default connect(mapStateToProps)(App)
