import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Form, Button, DatePicker, Radio } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class HistoryQueryForm extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    // Only show error after a field is touched.
    // const fromError = isFieldTouched('dateFrom') && getFieldError('dateFrom')
    // const toError = isFieldTouched('dateTo') && getFieldError('dateTo')
    // const inputNumberStyle = {
    //   width: '100%'
    // }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }]
    }
    const filterConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }]
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
            onClick={() => this.props.onOk(this.props.range.value[0], this.props.range.value[1], this.props.filter.value)}
          >
            Confirm request
          </Button>
        ]}
      >
        <Form layout='vertical'>
          <FormItem
            {...formItemLayout}
            label='From Date - To Date'
          >
            {getFieldDecorator('range', rangeConfig)(
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format='YYYY-MM-DD HH:mm'
                placeholder={['Start Time', 'End Time']}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='Filters'
          >
            {getFieldDecorator('filter')(
              <RadioGroup>
                <Radio value='a'>All</Radio>
                <Radio value='b'>Alarms</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

HistoryQueryForm.PropTypes = {
  form: PropTypes.object
}

const HistoryModal = connect((state) => {
  const { history } = state
  return history.modal
})(Form.create({
  mapPropsToFields (props) {
    return {
      range: Form.createFormField({
        ...props.range,
        value: props.range.value
      }),
      filter: Form.createFormField({
        ...props.filter,
        value: props.filter.value
      })
    }
  },
  onFieldsChange (props, fields) {
    // console.log('onFieldsChange', props, fields)
    props.onChange(fields)
  }
})(HistoryQueryForm))

export default HistoryModal
