/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-10-28 16:16:01
 */

import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Table } from "antd";
import "./TableList.less";
const columns = [
  {
    title: "Index",
    align: "left",
    dataIndex: "index",
    key: "index",
    width: 100,
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Result",
    dataIndex: "itemstring",
    align: "left",
    key: "itemstring",
    render: (text) => (text ? <span>{text}</span> : ""),
  },
  {
    title: "Confidence",
    dataIndex: "itemconf",
    align: "left",
    key: "itemconf",
    width: 120,
    render: (text) => (text ? <span>{text}%</span> : ""),
  },
];

// 声明组件  并对外输出
function TableList(props) {
  const { tableData, t } = props;
  console.log(tableData);
  return (
    <div className="result_wrap">
      {tableData.map((item, index) => {
        return (
          <div key={index} className="text item">
            <p className="item-desc">
              {t(item.type)}{" "}
              <img
                className={"block_bg" + " border_" + item.type}
                src={item.imgUrl}
              />
            </p>

            {item.code === 0 && (
              <Table
                rowKey={(record) => record.index}
                dataSource={item.text}
                columns={columns}
                pagination={false}
              />
            )}
            {item.code === -1 && t("reuslt-error")}
          </div>
        );
      })}
    </div>
  );
}
export default withTranslation("tableList")(TableList);
