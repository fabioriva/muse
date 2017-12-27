import React from 'react'
// import PropTypes from 'prop-types'
import { Modal, Form, Button, Icon, InputNumber } from 'antd'

const FormItem = Form.Item

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OperationForm extends React.Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName')
    const inputNumberStyle = {
      display: 'block',
      margin: '12px 0',
      width: '60%'
    }
    return (
      <Modal
        title={this.props.data.title}
        visible={this.props.data.visible}
        onCancel={this.props.onCancel}
        onOk={this.props.onOk}
        footer={[
          <Button
            key='back'
            onClick={this.props.onCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            disabled={hasErrors(getFieldsError())}
            onClick={() => this.props.onOk(this.props.data.value)}>
            Confirm request
          </Button>
        ]}
      >
        <Form>
          <FormItem
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please insert a valid card number!' }],
            })(
              <InputNumber
                prefix={<Icon type='user' style={{ fontSize: 13 }} />}
                style={inputNumberStyle}
                placeholder='Insert card number here'
                onChange={(n) => this.props.onChange(n)}
              />
            )}
          </FormItem>
          {/* <FormItem>
            <Button
              type='primary'
              htmlType='submit'
              disabled={hasErrors(getFieldsError())}
            >
              Log in
            </Button>
          </FormItem> */}
        </Form>
      </Modal>
    )
  }
}

const OperationModal = Form.create({onValuesChange: null})(OperationForm)

// Operation.propTypes = {
//   data: PropTypes.object.isRequired
// }

export default OperationModal
