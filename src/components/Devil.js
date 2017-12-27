import React, { Component } from 'react'
import { Row, Col, Button, Card, Icon, Radio, Tag, Tooltip } from 'antd'
import Blink from './Blink'
import Carousel from 'nuka-carousel'
import classnames from 'classnames'

import '../styles/Elevator.css'

const divStyle = {
  // background: '#FFEE00',
  border: '1px solid #e9e9e9',
  textAlign: 'center',
  minHeight: 41
}

const divRadioStyle = {
  border: '1px solid #e9e9e9',
  padding: 6
}

class Motor extends Component {
  render () {
    const motor = this.props.data
    const motorStat = motor.properties[motor.status || 0]
    const motorValue = motor.status !== 0 ? <span>{motor.speed}Hz<Blink><Icon style={{ margin: '0 6px' }} type={motorStat.icon} />{motorStat.name}</Blink></span> : <span>IDLE</span>
    // {motor.speed}Hz&nbsp;{motor.current}Amp<Blink><Icon style={{ margin: '0 6px' }} type={motorStat.icon} /></Blink>{motorStat.name}
    return (
      <div style={divStyle}>
        <p className='device-title'>{motor.name}</p>
        <p className='device-value'>{motorValue}</p>
      </div>
    )
  }
}

class Position extends Component {
  render () {
    const {name, position} = this.props.data
    const destination = position[0].destination
    return (
      <div style={divStyle}>
        <p className='pos-title'>
          {name}
        </p>
        <p className='pos-value'>
          { position.length === 1 ? (
            <span>{position[0].position}<Icon style={{ margin: '0 6px' }} type='arrow-right' />{destination}</span>
          ) : (
            <span>{position[0].position}/{position[1].position}<Icon style={{ margin: '0 6px' }} type='arrow-right' />{destination}</span>
          )}
        </p>
      </div>
    )
  }
}

class leftDecorator extends Component {
  render() {
    return (
      <Button shape='circle' icon='left' onClick={this.props.previousSlide} ghost />
      // <Icon type="left-circle-o" onClick={this.props.previousSlide}/>
    )
  }
}

class rightDecorator extends Component {
  render() {
    return (
      <Button shape='circle' icon='right' onClick={this.props.nextSlide} ghost />
      // <Icon type="right-circle-o" onClick={this.props.nextSlide}/>
    )
  }
}

var Decorators = [
  {
    component: leftDecorator,
    position: 'CenterLeft',
    style: {
      padding: 3
    }
  },
  {
    component: rightDecorator,
    position: 'CenterRight',
    style: {
      padding: 3
    }
  }
]

class Device extends Component {
  // state = {
  //   value: 1
  // }
  onChange = (e) => {
    this.props.onChangeRadio(e.target.value)
    // this.setState({
    //   value: e.target.value,
    // })
  }
  render () {
    const { name, card, mode, motor, operation, position, size, stall, step } = this.props.device.a
    
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
    const entryIcon =
      <Tooltip title='Car In'>
        <Icon type='swap-right' style={{ color: '#000000', marginLeft: 6 }} />
      </Tooltip>
    const exitIcon =
      <Tooltip title='Car Out'>
        <Icon type='swap-left' style={{ color: '#000000', marginLeft: 6 }} />
      </Tooltip>
    const shuffleIcon =
      <Tooltip title='Car Shuffle'>
        <Icon type='swap' style={{ color: '#000000', marginLeft: 6 }} />
      </Tooltip>
    const title = <span>{name}</span>
    const extra =
      <div>
        { modeTag }
        <Icon type='car' style={{ color: '#000000', marginLeft: 6 }} />
        { operation === 1 ? entryIcon : operation === 2 ? exitIcon : operation === 3 ? shuffleIcon : null }
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
        </Button>)
    })
    const motors = []
    motors.push(
      <div style={divStyle} key={-1}>
        <p className='device-title'>Operation</p>
        <Blink>
          <p className='device-value'>IDLE</p>
        </Blink>
      </div>
    )
    this.props.device.e.forEach((m, i) => {
      motors.push(<Motor data={m} key={i} />)
    })
    const radios = []
    this.props.device.g.forEach((r, i) => {
      radios.push(
        <Radio
          value={r.value}
          key={i}
        >
          {r.label}
        </Radio>
      )
    })
    const pos = []
    pos.push(
      <div style={divStyle} key={-1}>
        <p className='device-title'>Position</p>
        <Blink>
          <p className='device-value'>IDLE</p>
        </Blink>
      </div>
    )
    this.props.device.f.forEach((p, i) => {
      pos.push(<Position data={p} key={i} />)
    })
    return (
      <div>
        <Card title={title} extra={extra}>
          <div style={divRadioStyle}>
            <Radio.Group onChange={this.onChange} value={step}>
              { radios.length > 0 && radios }
            </Radio.Group>
          </div>
          <Row className='device-body' type='flex' justify='space-around' align='middle' gutter={2}>
            <Col span={12}>
              <div style={divStyle}>
                <p className='device-title'>Mode</p>
                <p className='device-value'>{mode}</p>
              </div>
            </Col>
            <Col span={12}>
              { motors.length > 0 && (
                <Carousel decorators={Decorators} slideIndex={motor}>
                  {motors}
                </Carousel>
              )}
            </Col>
          </Row>
          <Row className='device-body' type='flex' justify='space-around' align='middle' gutter={2}>
            <Col span={12}>
              <div style={divStyle}>
                <Carousel decorators={Decorators} autoplay={operation !== 0} autoplayInterval={1500} wrapAround>
                  <div>
                    <p className='device-title'>Card</p>
                    <p className='device-value'><Icon style={{ marginRight: 12 }} type='car' />{card}</p>
                  </div>
                  <div>
                    <p className='device-title'>Destination</p>
                    <p className='device-value'>{stall}</p>
                  </div>
                  <div>
                    <p className='device-title'>Vehicle Size</p>
                    <p className='device-value'>{size}</p>
                  </div>
                </Carousel>
              </div>
            </Col>
            <Col span={12}>
              { pos.length > 0 && (
                <Carousel decorators={Decorators} slideIndex={position}>
                  {pos}
                </Carousel>
              )}
            </Col>
          </Row>
          { buttons.length > 0 && <div className='ant-card-footer'>{buttons}</div> }
        </Card>
      </div>
    )
  }
}

export default Device
