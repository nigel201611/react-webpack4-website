import React, { Component } from "react";
import { Upload } from "antd";
import "./UploadComp.less";
export default function UploadComp(props) {
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://imageregdemo.nrihkerp.com"
      accept="image/jpg, image/jpeg, image/png"
      beforeUpload={props.beforeUpload}
      onChange={props.onChange}
    >
      {props.children}
    </Upload>
  );
}
