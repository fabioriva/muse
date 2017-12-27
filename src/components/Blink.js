import React, {Component} from 'react'
import PropTypes from 'prop-types'
/*
 * Fuck yeah, blink tag!
 */
class Blink extends Component {
  constructor (props) {
    super(props)
    this.state = {visible: true}
  }
  blink () {
    if (!this._ismounted) return
    this.setState({ visible: !this.state.visible })
  }
  componentDidMount () {
    this._ismounted = true
    setInterval(() => this.blink(), this.props.duration)
  }
  componentWillUnmount () {
    this._ismounted = false
  }
  render () {
    var props = blacklist(this.props, 'children', 'duration')
    props.style = { visibility: this.state.visible ? 'visible' : 'hidden' }
    return (
      <span {...props}>{this.props.children}</span>
    )
  }
}

Blink.defaultProps = {
  duration: 1000
}

Blink.PropTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number
}

export default Blink

function blacklist (src) {
  var copy = {}
  var filter = arguments[1]

  if (typeof filter === 'string') {
    filter = {}
    for (var i = 1; i < arguments.length; i++) {
      filter[arguments[i]] = true
    }
  }

  for (var key in src) {
    // blacklist?
    if (filter[key]) continue
    copy[key] = src[key]
  }

  return copy
}
