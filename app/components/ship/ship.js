/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-09-14 11:15:09
 */

import React, { Component } from 'react'
import '@styles/ship.less'
// 声明组件  并对外输出
export default class Ship extends Component {
  render() {
    return (
      <div className="boat">
        <div className="wrap">
          <div className="main">
            <div className="boat-top-layer">
              <div className="top">
                <div className="pole" />
                <div className="help">
                  <span />
                </div>
              </div>
              <div className="bottom" />
            </div>
            <div className="boat-mid-layer">
              <div className="top" />
              <div className="bottom" />
            </div>
            <div className="boat-bot-layer">
              <div className="top" />
              <div className="bottom" />
            </div>
          </div>
        </div>
        <div className="water">
          <div className="drops clearfix drops-1">
            <span className="drop drop-a" />
            <span className="drop drop-b" />
            <span className="drop drop-c" />
            <span className="drop drop-d" />
            <span className="drop drop-e" />
            <span className="drop drop-f" />
            <span className="drop drop-g" />
            <span className="drop drop-h" />
          </div>
          <div className="drops clearfix drops-2">
            <span className="drop drop-a" />
            <span className="drop drop-b" />
            <span className="drop drop-c" />
            <span className="drop drop-d" />
            <span className="drop drop-e" />
            <span className="drop drop-f" />
            <span className="drop drop-g" />
            <span className="drop drop-h" />
          </div>
        </div>
      </div>
    )
  }
}
