import React, { Component } from 'react'
import { Button } from 'antd'


export default class app extends Component {
  static defaultProps = {
  }
  static propTypes = {
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() { }
  // 发送socket数据
  onClickSend = () => {
    // Socket.send({ type: 'receive/hello3', data: { name: 'dupi' } })
  }

  render() {
    return (
      <div className="page">
        示范页面
        <div>
          <Button onClick={this.onClickSend}>发送</Button>
        </div>
      </div>
    )
  }
}
