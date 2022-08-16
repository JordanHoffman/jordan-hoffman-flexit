import React from 'react';
import './Toast.scss'

class Toast extends React.Component {
  state = {
    visible : false
  }

  componentDidMount() {
    //must be done async for fade to work
    setTimeout(() => {
      this.setState({visible: true})
    }, 10);
  }


  render() {
    return (
      <div className={this.props.ctrClass + ' toast' + (this.state.visible ? '' : ' toast--invisible')}>
        {this.props.message}
      </div>
    )
  }
}

export default Toast;