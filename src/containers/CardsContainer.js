import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchCards,
  cardEdit,
  cardModal
} from '../actions/cards'
import { Table } from 'antd'
import Loading from '../components/Loading'
import CardModal from '../components/CardModal'
import dialog from '../api/dialog'
import moment from 'moment'

const columns = [
  {
    title: 'Number',
    dataIndex: 'nr',
    key: 'nr'
  }, {
    title: 'PIN Code',
    dataIndex: 'code',
    key: 'code'
  }, {
    title: 'Valid From',
    dataIndex: 'from',
    key: 'from'
  }, {
    title: 'Valid To',
    dataIndex: 'to',
    key: 'to'
  }
]

class App extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    lastUpdated: PropTypes.number,
    cards: PropTypes.array.isRequired,
    modal: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchCards('cards'))
  }
  showModal = (card, code, timeFrom, timeTo) => {
    this.props.dispatch(cardModal({ card: { value: card }, code: { value: code }, timeFrom: { value: moment(timeFrom, 'HH:mm:ss') }, timeTo: { value: moment(timeTo, 'HH:mm:ss') }, visible: true }))
  }
  handleCancel = () => {
    this.props.dispatch(cardModal({ visible: false }))
  }
  handleChange = fields => {
    this.props.dispatch(cardModal(fields))
  }
  handleConfirm = (card, code, timeFrom, timeTo) => {
    dialog.showMessageBox('warning', ['Cancel', 'OK'], 'Operation Request', `Confirm card ${card} operation ?`, (confirm) => {
      if (confirm) {
        const { dispatch } = this.props
        dispatch(cardEdit({ card: { value: card }, code: { value: code }, timeFrom: { value: timeFrom }, timeTo: { value: timeTo } }))
        dispatch(cardModal({ visible: false }))
      }
    })
  }
  handleRefresh = () => {
    this.props.dispatch(fetchCards('cards'))
  }
  render () {
    const {
      isFetching,
      lastUpdated,
      cards,
      modal
    } = this.props
    return (
      <div className='content'>
        {lastUpdated &&
          <span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
            {' '}
          </span>
        }
        {!isFetching &&
          <a
            onClick={this.handleRefresh}>
            Refresh
          </a>
        }
        {
          isFetching
          ?
          <Loading tip='Loading' />
          :
          <div>
            <Table
              dataSource={cards}
              columns={columns}
              bordered
              size='small'
              pagination={{ defaultPageSize: 20 }}
              rowKey='nr'
              onRowClick={(record, index, event) => this.showModal(record.nr, record.code, record.from, record.to)}
            />
            <CardModal
              title='Card Edit'
              visible={modal.visible}
              onCancel={this.handleCancel}
              onChange={this.handleChange}
              onOk={this.handleConfirm}
            />
          </div>
        }
      </div>
    )
  }
}

// App.propTypes = {
//   isFetching: PropTypes.bool,
//   lastUpdated: PropTypes.number,
//   cards: PropTypes.array.isRequired,
//   modal: PropTypes.object.isRequired,
//   dispatch: PropTypes.func.isRequired
// }

function mapStateToProps (state) {
  const { cards } = state
  return cards
}

export default connect(mapStateToProps)(App)