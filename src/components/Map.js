import React, { Component } from 'react'
import classnames from 'classnames'
import { Tooltip } from 'antd'

class Stall extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  render () {
    var title = this.props.stall.card !== 0 ? 'Stall number ' + this.props.stall.nr + ' is busy with card ' + this.props.stall.card + ' since ' + this.props.stall.date : 'Stall is empty'
    return (
      <Tooltip placement='top' title={title}>
        <div
          className={classnames({
            's': true,
            's-busy': this.props.stall.card !== 0,
            's-free': this.props.stall.card === 0,
            's-lock': this.props.stall.card === 999,
            's-papa': this.props.stall.card === 997,
            's-rsvd': this.props.stall.card === 998
          })}
          id={'s-' + this.props.stall.nr}
        >
          <span className='st' onClick={() => this.handleClick(this.props.stall.nr, this.props.stall.card)}>{this.props.stall.label}</span>
        </div>
      </Tooltip>
    )
  }
  handleClick (stall, card) {
    this.props.openModal(stall, card)
  }
}

export default class Level extends Component {
  render () {
    var stalls = []
    this.props.level.stalls.forEach((stall, i) => {
      stalls.push(
        <Stall
          stall={stall}
          key={i}
          side={this.props.side}
          openModal={this.props.openModal}
        />
      )
    })
    return (
      <span>
        <strong>{this.props.level.label}: {this.props.level.min} - {this.props.level.max}</strong>
        <div className={this.props.side + '-l l'} id={'l-' + this.props.level.nr}>
          <span>{stalls}</span>
        </div>
      </span>
    )
  }
}

// export default class Map extends Component {
//   render () {
//     const levels = []
//     this.props.map.levels.forEach((level, i) => {
//       levels.push(
//         <Level
//           level={level}
//           key={i}
//           side={this.props.side}
//           openModal={this.props.openModal}
//         />
//       )
//     })
//     return (
//       <div>
//         {levels}
//       </div>
//     )
//   }
// }
