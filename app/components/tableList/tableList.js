/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-11-16 11:01:54
 */

import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Table } from "antd";
import "./TableList.less";

// 声明组件  并对外输出
function TableList(props) {
  const { tableData, t } = props;
  const columns = [
    {
      title: "#",
      align: "left",
      dataIndex: "index",
      key: "index",
      width: 100,
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("result"),
      dataIndex: "itemstring",
      align: "left",
      key: "itemstring",
      render: (text) => (text ? <span>{text}</span> : ""),
    },
    {
      title: t("confidence"),
      dataIndex: "itemconf",
      align: "left",
      key: "itemconf",
      width: 120,
      render: (text) => (text ? <span>{text}%</span> : ""),
    },
  ];
  return (
    <div className="result_wrap">
      {tableData.map((item, index) => (
        <div key={index} className="text item">
          <p className="item-desc">
            <img
              className={`${"block_bg" + " border_"}${item.type}`}
              src={item.imgUrl}
            />
            {item.code === -1 && t("reuslt-error")}
          </p>
          {item.code === 0 && (
            <Table
              rowKey={(record) => record.index}
              dataSource={item.text}
              columns={columns}
              pagination={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}
export default withTranslation("tableList")(TableList);
