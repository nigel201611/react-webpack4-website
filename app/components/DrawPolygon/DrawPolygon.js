/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-11-10 14:52:31
 */

import React from "react";
import "./DrawPolygon.less";

// 声明组件  并对外输出
export default function DrawLine(props) {
  const {
    polygonSvgWidth,
    polygonSvgHeight,
    polygonPostcodePoints,
    polygonAddressPoints,
    polygonNamePoints,
    imageUrl,
    scaleX,
    scaleY,
  } = props;

  return (
    <div className="avatar" style={{ backgroundImage: `url(${imageUrl})` }}>
      <svg
        id="polygonSvg"
        className="polygonSvg"
        width={polygonSvgWidth}
        height={polygonSvgHeight}
        viewport="0 0 120 120"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`scale(${scaleX} ${scaleY})`}>
          <polygon
            id="polygonPostcode"
            points={polygonPostcodePoints}
            stroke="#d601fd"
            fillOpacity="0"
            strokeWidth="2"
          />
          <polygon
            id="polygonAddress"
            points={polygonAddressPoints}
            stroke="#07be14"
            fillOpacity="0"
            strokeWidth="2"
          />
          <polygon
            id="polygonName"
            points={polygonNamePoints}
            stroke="#fd0101"
            fillOpacity="0"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}
