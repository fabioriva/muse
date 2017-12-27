import React, { Component } from 'react'
import { Row, Col, Icon, Timeline } from 'antd'

class App extends Component {
  render () {
    return (
      <div className='content'>
        <Row type='flex' justify='center' align='top' gutter={16}>
          <Col span={6}>
            <h2>Elevator 1</h2>
            <Timeline>
              <Timeline.Item color='green'>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item color='green'>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item color='red'>
                <p>Solve initial network problems 1</p>
                <p>Solve initial network problems 2</p>
                <p>Solve initial network problems 3 2015-09-01</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>Technical testing 1</p>
                <p>Technical testing 2</p>
                <p>Technical testing 3 2015-09-01</p>
                <p>Technical testing 3 2015-09-01</p>
              </Timeline.Item>
            </Timeline>
          </Col>
          <Col span={6}>
            <h2>Elevator 2</h2>
            <Timeline>
              <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type='clock-circle-o' style={{ fontSize: '16px' }} />} color='red'>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
            </Timeline>
          </Col>
          <Col span={6}>
            <h2>Elevator 3</h2>
            <Timeline pending={<a href='#'>See more</a>}>
              <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
            </Timeline>
          </Col>
          <Col span={6}>
            <h2>Elevator 4</h2>
            <Timeline>
              <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
              <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
            </Timeline>
          </Col>
        </Row>
      </div>
    )
  }
}

export default App
