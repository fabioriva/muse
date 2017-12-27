import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, InputNumber } from 'antd'
import { CARDS, STALLS, StallStatus } from '../constants/Aps'

class Edit extends React.Component {
  render () {
    const style = {
      display: 'block',
      margin: '12px 0',
      width: '60%'
    }
    return (
      <Modal
        title='Edit Stall'
        visible={this.props.data.visible}
        onOk={() => this.props.onConfirm(this.props.data.stall, this.props.data.value)}
        onCancel={this.props.onCancel}
        footer={[
          <Button key='back' size='large' onClick={this.props.onCancel}>
            Cancel
          </Button>,
          <Button key='card' type='primary' size='large' onClick={() => this.props.onConfirm(this.props.data.stall, this.props.data.value)}>
            Card
          </Button>,
          <Button key='canc' type='primary' size='large' onClick={() => this.props.onConfirm(this.props.data.stall, StallStatus.FREE)}>
            Clear
          </Button>,
          <Button key='lock' type='primary' size='large' onClick={() => this.props.onConfirm(this.props.data.stall, StallStatus.LOCK)}>
            Lock
          </Button>
        ]}
      >
        <label style={style} htmlFor='stall-nr'>Stall Number</label>
        <InputNumber
          id='stall-nr'
          style={style}
          min={1}
          max={STALLS}
          defaultValue={this.props.data.stall}
          value={this.props.data.stall}
          onChange={(e) => this.props.onChange(e, this.props.data.value)}
        />
        <label style={style} htmlFor='card-nr'>Card Number</label>
        <InputNumber
          id='card-nr'
          style={style}
          min={1}
          max={CARDS}
          defaultValue={this.props.data.value}
          value={this.props.data.value}
          onChange={(e) => this.props.onChange(this.props.data.stall, e)}
        />
      </Modal>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object.isRequired
}

export default Edit
