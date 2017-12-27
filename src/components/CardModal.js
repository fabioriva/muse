import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Form, Button, Input, InputNumber, TimePicker } from 'antd'
import { CARDS } from '../constants/Aps'
import moment from 'moment'

const FormItem = Form.Item

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class CardEditForm extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  checkTimeFrom = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    validateFields(['timeTo'], {
      force: true,
    });
    callback();
  }
  checkTimeTo = (rule, value, callback) => {
    const end = value;
    const { getFieldValue } = this.props.form;
    const start = getFieldValue('timeFrom');
    if (!end || !start) {
      callback('please select both start and end time');
    } else if (end.valueOf() < start.valueOf()) {
      callback('start time should be less than end time');
    } else {
      callback();
    }
  }
  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const { card, code, timeFrom, timeTo } = this.props
    // Only show error after a field is touched.
    const cardError = isFieldTouched('card') && getFieldError('card')
    const codeError = isFieldTouched('code') && getFieldError('code')
    const timeFromError = isFieldTouched('timeFrom') && getFieldError('timeFrom')
    const timeToError = isFieldTouched('timeTo') && getFieldError('timeTo')
    const inputStyle = {
      // display: 'block',
      // margin: '12px 0',
      width: '100%'
    }
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        footer={[
          <Button
            key='back'
            onClick={this.props.onCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            disabled={hasErrors(getFieldsError())}
            onClick={() => this.props.onOk(card.value, code.value, timeFrom.value.format('HH:mm:ss'), timeTo.value.format('HH:mm:ss'))}
          >
            Confirm request
          </Button>
        ]}
      >
        <Form layout='horizontal'>
          <FormItem
            validateStatus={cardError ? 'error' : ''}
            help={cardError || ''}
            label='Card number'
          >
            {getFieldDecorator('card', {
              // initialValue: 1,
              rules: [{
                required: true,
                type: 'integer',
                min: 1,
                max: CARDS,
                message: 'Please insert a valid card number!' }],
            })(
              <InputNumber
                style={inputStyle}
                placeholder='Insert card number here'
                disabled
              />
            )}
          </FormItem>
          <FormItem
            validateStatus={codeError ? 'error' : ''}
            help={codeError || ''}
            label='Card PIN code'
          >
            {getFieldDecorator('code', {
              // initialValue: '000',
              rules: [{
                required: true,
                type: 'string',
                len: 3,
                pattern: '^[a-fA-F0-9]{3}$',
                message: 'Please insert a valid pin code!' }],
            })(
              <Input
                style={inputStyle}
                placeholder='Insert pin code here'
              />
            )}
          </FormItem>
          <FormItem
            validateStatus={timeFromError ? 'error' : ''}
            help={timeFromError || ''}
            label='From Time'
          >
            {getFieldDecorator('timeFrom', {
              rules: [{
                required: true,
                type: 'object', // moment object
                message: 'Please insert a valid time!' }, this.checkTimeFrom],
            })(
              <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
            )}
          </FormItem>
          <FormItem
            validateStatus={timeToError ? 'error' : ''}
            help={timeToError || ''}
            label='To Time'
          >
            {getFieldDecorator('timeTo', {
              rules: [{
                required: true,
                type: 'object', // moment object
                message: 'Please insert a valid time!' }, this.checkTimeTo],
            })(
              <TimePicker defaultOpenValue={moment('23:59:59', 'HH:mm:ss')} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

CardEditForm.PropTypes = {
  form: PropTypes.object
}

const CardModal = connect((state) => {
  const { cards } = state
  return cards.modal
})(Form.create({
  mapPropsToFields (props) {
    console.log(props.timeFrom.value, typeof props.timeFrom.value)
    return {
      card: {
        ...props.card,
        value: props.card.value
      },
      code: {
        ...props.code,
        value: props.code.value
      },
      timeFrom: {
        ...props.timeFrom,
        value: moment(props.timeFrom.value, 'HH:mm:ss')
      },
      timeTo: {
        ...props.timeTo,
        value: moment(props.timeTo.value, 'HH:mm:ss')
      }
    }
  },
  onFieldsChange (props, fields) {
    // console.log('onFieldsChange', props, fields)
    props.onChange(fields)
  }
})(CardEditForm))

export default CardModal
