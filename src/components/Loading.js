import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'

const container = {
  textAlign: 'center',
  marginTop: 128
}

const Loading = ({ tip }) => (
  <div style={container}>
    <Spin className='interstitial-wrapper' size='default' tip={tip} />
  </div>
)

Loading.propTypes = {
  tip: PropTypes.string.isRequired
}

export default Loading
