/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-11-11 11:36:54
 */

import React from "react";
import "./index.less";
// 声明组件  并对外输出
export default function DrawLine(props) {
  const { postcodePoints, addressPoints, namePoints } = props;
  return (
    <svg
      className="lineSvg"
      viewport="0 0 120 120"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        id="dashedLinePostcode"
        x1={postcodePoints.start.x}
        y1={postcodePoints.start.y}
        x2={postcodePoints.end.x}
        y2={postcodePoints.end.y}
        stroke="#d601fd"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
      <line
        id="dashedLineAddress"
        x1={addressPoints.start.x}
        y1={addressPoints.start.y}
        x2={addressPoints.end.x}
        y2={addressPoints.end.y}
        stroke="#07be14"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
      <line
        id="dashedLineName"
        x1={namePoints.start.x}
        y1={namePoints.start.y}
        x2={namePoints.end.x}
        y2={namePoints.end.y}
        stroke="#fd0101"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
    </svg>
  );
}

DrawLine.defaultProps = {
  postcodePoints: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
  addressPoints: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
  namePoints: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
};
