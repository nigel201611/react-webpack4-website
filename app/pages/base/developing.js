import React, { Component } from 'react';
import { Progress } from 'antd';

// 声明组件  并对外输出
export default class developing extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      // activeTab: 'pop' ,
    };
  }

  // 组件已经加载到dom中
  componentDidMount() {}

  render() {
    return (
      <div
        className="developing"
        style={{
          height: '86vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Progress
          type="circle"
          percent={100}
          format={() => 'Coming online soon, please look forward to...'}
          width={200}
          status="active"
        />
      </div>
    );
  }
}
