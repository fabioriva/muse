import React, { Component } from 'react'
import { Row, Col, Button, Card, Icon, Tag, Tooltip } from 'antd'
import Carousel from 'nuka-carousel'
import classnames from 'classnames'

import '../styles/Device.css'

class MeasuringDevice extends Component {
  render () {
    const { name, destination, position } = this.props
    return (
      <div>
        <p className='slide-title'>
          {name}
        </p>
        <p className='slide-value'>
          { destination === undefined ? <span>OFFLINE</span> : <span className='slide-value-destination'>{position}<Icon style={{ margin: '0 6px' }} type='arrow-right' />{destination}</span> }
        </p>
      </div>
    )
  }
}

class Device extends Component {
  render () {
    const { name, card, mode, operation, size, stall } = this.props.device.a
    const infoSlides = []
    Object.keys(this.props.device.a).forEach((item, i) => {
      // console.log(item, i, this.props.device.a[item])
      if (item !== 'name' && this.props.device.a[item] !== 0) {
        infoSlides.push(
          <div>
            <p className='slide-title'>{item}</p>
            <p className='slide-value'>{this.props.device.a[item]}</p>
          </div>
        )
      }
    })
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
    var rows = []
    this.props.device.b.forEach((m, i) => {
      rows.push(<MeasuringDevice name={m.name} destination={m.destination} position={m.position} key={i} />)
    })
    var buttons = []
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
        </Button>)
    })
    return (
      <div>
        <Card title={name} extra={extra}>
          <Row className='device-body' type='flex' justify='space-around' align='middle'>
            <Col className='col-r' span={rows.length > 0 ? 12 : 24}>
              <Carousel autoplay={infoSlides.length > -1} autoplayInterval={1500} wrapAround>
                {/* {infoSlides} */}
                <div style={{ textAlign: 'center' }}>
                  <p className='slide-title'>Mode</p>
                  <p className='slide-value'>{mode}</p>
                </div>
                <div>
                  <p className='slide-title'>Card</p>
                  <p className='slide-value'><Icon style={{ marginRight: 12 }} type='car' />{card}</p>
                </div>
                <div>
                  <p className='slide-title'>Destination</p>
                  <p className='slide-value'>{stall}</p>
                </div>
                <div>
                  <p className='slide-title'>Vehicle Size</p>
                  <p className='slide-value'>{size}</p>
                </div>
              </Carousel>
            </Col>
            <Col className='col-r' span={rows.length > 0 ? 12 : 0}>
              <Carousel slideIndex={operation}>
                {rows}
              </Carousel>
            </Col>
          </Row>
          { buttons.length > 0 && <div className='ant-card-footer'>{buttons}</div> }
        </Card>
      </div>
    )
  }
}

export default Device
