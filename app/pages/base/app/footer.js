import React, { Component } from "react";
import { connect } from "react-redux";
import "@styles/footer.less";

@connect((state, props) => ({
  config: state.config,
  staffResponse: state.staffResponse,
}))
export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <p>
          Copyright (c) Nomura Research Institute, Ltd. All rights reserved.
        </p>
      </footer>
    );
  }
}
