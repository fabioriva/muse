import { message } from 'antd'

const DURATION = 5

export default {
  emit (type, content) {
    switch (type) {
      case 'ERROR':
        message.error(content, DURATION)
        break
      case 'SUCCESS':
        message.success(content, DURATION)
        break
      case 'WARNING':
        message.warning(content, DURATION)
        break
      default:
        message.info(content, DURATION)
    }
  }
}
