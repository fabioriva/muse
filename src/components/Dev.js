import React, { Component } from 'react'
import { Row, Col, Button, Card, Icon, Tag, Tooltip } from 'antd'
import Carousel from 'nuka-carousel'
import classnames from 'classnames'

class MeasuringDevice extends Component {
  render () {
    const { name, iconFwd, iconBwd, destination, position } = this.props.data
    return (
      <div>
        <p className='pos-title'>{name}</p>
        <Icon className='device-icon' type={position < destination ? iconFwd : iconBwd} />
        <p className='pos-value'>
          { destination === undefined ? <span>OFFLINE</span> : <span>{position}<Icon style={{ margin: '0 6px' }} type='arrow-right' />{destination}</span> }
        </p>
      </div>
    )
  }
}

class Dev extends Component {
  render () {
    const { name, card, mode, operation, size, stall } = this.props.device.a
    const autTag =
      <Tooltip title='Automatic'>
        <Tag color='#108ee9' style={{ width: 32, textAlign: 'center', color: '#fff' }}>A</Tag>
      </Tooltip>
    const manTag =
      <Tooltip title={mode}>
        <Tag color='#ffff00' style={{ width: 32, textAlign: 'center', color: '#000' }}>M</Tag>
      </Tooltip>
    const modeTag =
      <span>
        { mode !== 'Automatic' ? manTag : autTag }
      </span>
    const extra =
      <div>
        { modeTag }
        <Icon type='car' style={{ color: '#000000', marginLeft: 6 }} />
        <Tooltip title={this.props.device.c[2].status ? 'Alarm Lamp' : 'Alarm Lamp'}>
          <Icon
            type='close-circle'
            className={classnames({
              'lamp lamp-alarm-on': this.props.device.c[2].status,
              'lamp lamp-alarm-off': !this.props.device.c[2].status
            })}
          />
        </Tooltip>
        <Tooltip title={this.props.device.c[1].status ? 'Ready' : 'Not Ready'}>
          <Icon
            type='check-circle'
            className={classnames({
              'lamp lamp-center-on': this.props.device.c[1].status,
              'lamp lamp-center-off': !this.props.device.c[1].status
            })}
          />
        </Tooltip>
        <Tooltip title={this.props.device.c[0].status ? 'System On' : 'System Off'}>
          <Icon
            type='check-circle'
            className={classnames({
              'lamp lamp-ready-on': this.props.device.c[0].status,
              'lamp lamp-ready-off': !this.props.device.c[0].status
            })}
          />
        </Tooltip>
      </div>
    const rows = []
    this.props.device.b.forEach((m, i) => {
      rows.push(<MeasuringDevice data={m} key={i} />)
    })
    const buttons = []
    this.props.device.d.forEach((b, i) => {
      buttons.push(
        <Button
          style={{ marginRight: 6, width: 96 }}
          type='default'
          disabled={!b.disabled.status}
          icon={b.icon !== undefined && b.icon}
          key={i}
          onClick={this.props.showModal}
        >
          {b.label}
        </Button>
      )
    })
    return (
      <Card title={name} extra={extra}>
        <Row className='device-body' type='flex' justify='space-around' align='middle'>
          <Col span={operation !== 65535 ? 12 : 24}>
            <p>{mode}</p>
            <Icon className='device-icon' type='car' />
            {/* <Icon className='device-icon' type='swap' /> */}
            <Carousel autoplay autoplayInterval={2000} wrapAround>
              <div className='device-value'>Card {card}</div>
              <div className='device-value'>Stall {stall}</div>
              <div className='device-value'>Size {size}</div>
            </Carousel>
          </Col>
          <Col span={operation !== 65535 ? 12 : 0}>
            <Carousel autoplay={false} autoplayInterval={3000} wrapAround slideIndex={operation} >
              {rows}
            </Carousel>
          </Col>
        </Row>
        { buttons.length > 0 && <div className='ant-card-footer'>{buttons}</div> }
      </Card>
    )
  }
}

export default Dev
