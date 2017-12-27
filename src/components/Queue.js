import React, { Component } from 'react'
import dialog from '../api/dialog'
import { Card, Button, Icon } from 'antd'
import Carousel from 'nuka-carousel'

class Slide extends Component {
  render () {
    const { card, id } = this.props
    return (
      <div className='queue-slide'>
        <p className='queue-title'>
          { id === 0 ? <span>Next</span> : <span>Position {id + 1}</span> }
        </p> 
        <p className='queue-value'>
          <Button style={{ marginRight: 16 }} type='default' icon='delete' shape='circle' onClick={() => this.props.onDelete(card, id)} />
          <Icon style={{ marginRight: 16 }} type='car' />
          {card}
        </p>
      </div>
    )
  }
}

class Queue extends Component {
  handleDelete = (card, index) => {
    dialog.showMessageBox('warning', ['Cancel', 'OK'], 'Exit Queue', `Delete card ${card} from Exit Queue ?`, (res) => {
      if (res) console.log(card, index)
    })
  }
  render () {
    const {
      queueList,
      exitButton,
    } = this.props.exitQueue
    const queue = []
    queueList.forEach((item, i) => {
      if (item.card !== 0) queue.push(<div key={i}><Slide card={item.card} id={i} onDelete={this.handleDelete} /></div>)
    })
    const button =
      <Button
        style={{ width: '100%' }}
        type='default'
        disabled={!exitButton.disabled.status}
        icon='logout'
        onClick={this.props.showModal}
      >
        Exit Car
      </Button>
    return (
      <div>
        <Card title='Exit Queue' style={{ width: '100%' }} >
          <Carousel autoplay={queue.length > 1} autoplayInterval={3000} vertical wrapAround>
            {queue.length > 0 ? queue : <div className='queue-slide'>Empty</div>}
          </Carousel>
          <div className='queue-footer'>
            {button}
          </div>
        </Card>
      </div>
    )
  }
}

export default Queue
