import { notification } from 'antd'
import moment from 'moment'

// export default {
//   emit (log) {
//     console.log(typeof log, log, moment(log.date).format('YYYY-MM-DD HH:mm:ss'))
//     switch (log.type) {
//       case 'ERROR':
//         notification.error({
//           message: log.device,
//           description: log.description
//         })
//         break
//       case 'SUCCESS':
//         notification.success({
//           message: log.message,
//           description: log.description
//         })
//         break
//       case 'WARNING':
//         notification.warning({
//           message: log.message,
//           description: log.description
//         })
//         break
//       default:
//         notification.open({
//           message: log.message,
//           description: log.description
//         })
//     }
//   }
// }

export default {
  emit (log) {
    const description = moment(log.date).format('YYYY-MM-DD HH:mm:ss')
    switch (log.operation) {
      // Alarm ->
      case 1:
        notification.error({
          message: log.device,
          description: description
        })
        break
      // Alarm <-
      case 2: // Alarm Out
        notification.success({
          message: log.device,
          description: description
        })
        break
      case 3: // Mode switch
        notification.warning({
          message: log.device,
          description: description
        })
        break
      case 4: // Edit code
        notification.warning({
          message: log.device,
          description: description
        })
        break
      case 5: // Map In
      case 6: // Map Out
      case 7: // Shuffle In
      case 8: // Shuffle Out
        notification['success']({
          message: log.device,
          description: description
        })
        break
      default:
        notification.info({
          message: log.device,
          description: description
        })
    }
  }
}
