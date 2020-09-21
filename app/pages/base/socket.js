/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-18 20:10:18
 */

import React, { Component } from "react";
import socket from "@configs/socket";
import { socketReceive } from "@actions/common";
import { connect } from "react-redux";

@connect(() => ({}))
export default class SocketOn extends Component {
  componentDidMount() {
    console.log("socket didmount");
    this.init();
  }

  init = () => {
    const callback = (res) => {
      this.props.dispatch(socketReceive(res));
    };
    socket.on("dispatch", callback);
  };

  render() {
    return null;
  }
}
