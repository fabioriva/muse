import React from 'react'
import PropTypes from 'prop-types'
import { APS } from '../constants/Aps'

const Header = ({ title }) => (
  <div className='page-header'>
    <h2 className='brand'>{title}&nbsp;<small className='text-muted' dangerouslySetInnerHTML={{__html: APS}} /></h2>
  </div>
)

Header.propTypes = {
  title: PropTypes.string.isRequired
}

export default Header
