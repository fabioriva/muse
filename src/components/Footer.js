import React, { Component } from 'react'
const process = window.require('electron').remote.require('process')
const shell = window.require('electron').shell

class Footer extends Component {
  openLink = () => shell.openExternal('http://www.sotefin.com')
  render () {
    return (
      <div className='footer'>
        Parking Manager &copy; 2017-present <a onClick={this.openLink}>Sotefin SA</a>&middot; Electron {process.versions.electron} &middot; Node {process.versions.node}
      </div>
    )
  }
}

export default Footer
