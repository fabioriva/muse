import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import {
  fetchHistory,
  historyModal
} from '../actions/history'
import { Button, Table } from 'antd'
import Loading from '../components/Loading'
import HistoryModal from '../components/HistoryModal'
import '../styles/History.css'

const ITEMS_PER_PAGE = 20
const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date'
  }, {
    title: 'Device',
    dataIndex: 'device',
    key: 'device'
  }, {
    title: 'Mode',
    dataIndex: 'mode',
    key: 'mode'
  }, {
    title: 'Operation Id',
    dataIndex: 'operation',
    key: 'operation',
    className: 'col-hidden'
  }, {
    title: 'Operation',
    dataIndex: 'info',
    key: 'info'
  }, {
    title: 'Card',
    dataIndex: 'card',
    key: 'card',
    render: (text, record) => (text === 999 ? <span className='col'>Locked</span> : text)
  }, {
    title: 'Stall',
    dataIndex: 'stall',
    key: 'stall',
    className: 'col-align-center',
  }, {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    className: 'col-align-center',
  }
]

class App extends Component {
  constructor (props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }
  componentDidMount () {
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    this.historyQuery({ itemsPerPage: ITEMS_PER_PAGE, currentPage: 1, dateFrom: yesterday, dateTo: new Date() })
  }
  handleRefreshClick (e) {
    e.preventDefault()
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    this.historyQuery({ itemsPerPage: ITEMS_PER_PAGE, currentPage: 1, dateFrom: yesterday, dateTo: new Date() })
  }
  historyQuery (queryParam) {
    const { dispatch } = this.props
    dispatch(fetchHistory('selectedSystem', queryParam))
  }

  showModal () {
    this.props.dispatch(historyModal({ visible: true }))
  }
  handleCancel () {
    this.props.dispatch(historyModal({ visible: false }))
  }
  handleChange (field) {
    this.props.dispatch(historyModal(field))
  }
  handleConfirm (dateFrom, dateTo, filter) {
    console.log('onOk: ', dateFrom, dateTo, filter)
    this.props.dispatch(historyModal({ visible: false }))
    this.historyQuery({ itemsPerPage: ITEMS_PER_PAGE, currentPage: 1, dateFrom: dateFrom.toDate(), dateTo: dateTo.toDate(), filter: filter })
  }
  render () {
    const {
      isFetching,
      lastUpdated,
      history,
      modal
    } = this.props.history
    return (
      <div className='content'>
        <div className='history-container'>
          <div>
            {lastUpdated &&
              <span>
                Total items <strong>{history.query.totalItems}</strong>.
                History from <strong>{history.query.dateFrom}</strong> to <strong>{history.query.dateTo}</strong>.
                Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                {' '}
              </span>
            }
            {!isFetching &&
              <a
                onClick={this.handleRefreshClick}>
                Refresh
              </a>
            }
          </div>
          <div>
            <Button
              type='primary'
              icon='search'
              onClick={this.showModal}
            >
              Query
            </Button>
          </div>
        </div>
        {
          isFetching ? <Loading tip='Loading' /> : (
            <div>
              <Table
                dataSource={history.rows}
                columns={columns}
                bordered
                size='small'
                pagination={{ defaultPageSize: ITEMS_PER_PAGE }}
                rowKey='nr'
                rowClassName={(record, index) => this.rowClassname(record)}
              />
              <HistoryModal
                title='History Query'
                visible={modal.visible}
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
  rowClassname = (row) => {
    return classnames({
      'col-danger' : row.operation === 1,
      'col-success': row.operation === 2,
      'col-warning': row.operation === 3,
      'col-info'   : row.operation === 4
    })
  }
}

function mapStateToProps (state) {
  const { history } = state
  return {
    history
  }
}

export default connect(mapStateToProps)(App)
