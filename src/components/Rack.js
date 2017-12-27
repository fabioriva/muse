import React, {Component} from 'react'
import { Tooltip } from 'antd'

class Bit extends Component {
  render () {
    var className = 'bit-' + this.props.serie
    var id = 'r' + this.props.rack + '-c' + this.props.card + '-b' + this.props.byte + '-i' + this.props.bit
    var false_ = <div id={id + '-st'} className={className + '-st bit-false'}>{this.props.status}</div>
    var true_ = <div id={id + '-st'} className={className + '-st bit-true'}>{this.props.status}</div>
    return (
      <span>
        <Tooltip placement='top' title={this.props.info}>
          <div id={id + '-id'} className={className + '-id'}>{this.props.label}</div>
        </Tooltip>
        {this.props.status ? true_ : false_}
        <div id={id + '-nr'} className={className + '-nr'}>{this.props.bit}</div>
      </span>
    )
  }
}

class Byte extends Component {
  render () {
    var serie = this.props.serie
    var id = 'r' + this.props.rack + '-c' + this.props.card + '-b' + this.props.byte
    var bits = this.props.bits.map((bit, i) => {
      return <Bit key={i} rack={this.props.rack} serie={this.props.serie} card={this.props.card} byte={this.props.byte} bit={i} addr={bit.addr} label={bit.label} info={bit.info} status={bit.status} />
    })
    return (
      <span>
        <div className={'label-' + serie} id={id}>{this.props.label}</div>
        <span>{bits}</span>
      </span>
    )
  }
}

class Card extends Component {
  render () {
    var serie = this.props.serie
    var id = 'r' + this.props.rack + '-c' + this.props.card
    var bytes = this.props.bytes.map((byte, i) => {
      return <Byte key={i} rack={this.props.rack} serie={this.props.serie} card={this.props.card} byte={i} label={byte.label} bits={byte.bits} />
    })
    return (
      <div className={'card-' + serie} id={id}>
        <div className={'title-' + serie}>Card {this.props.card}</div>
        <div className={'type-' + serie}>{this.props.type}</div>
        <span>{bytes}</span>
      </div>
    )
  }
}

class Rack extends Component {
  // constructor (props) {
  //   super(props)
  // }
  // componentDidMount () {
  //   $('#rack-navs' + ' li:eq(0) a').tab('show')
  //   $('[data-toggle="tooltip"]').tooltip()
  // }
  render () {
    var cards = this.props.rack.cards.map((card, i) => {
      return <Card key={i} rack={this.props.rack.nr} serie={this.props.rack.serie} card={card.nr} type={card.type} bytes={card.bytes} />
    })
    return (
      <div className='rack-container' id={'rack-' + this.props.rack.nr}>
        <span className='rack'>Simatic PLC Rack {this.props.rack.nr}</span>
        <div>{cards}</div>
      </div>
    )
  }
}

export default Rack
