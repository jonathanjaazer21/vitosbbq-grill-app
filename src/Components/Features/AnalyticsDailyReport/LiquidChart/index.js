import React, { useState, useEffect } from "react"
import { Liquid } from "@ant-design/charts"

const LiquidChart = ({ percent }) => {
  const [percentage, setPercentage] = useState(0)
  useEffect(() => {
    setPercentage(percent)
  }, [percent])
  const config = {
    percent: percentage,
    outline: {
      border: 4,
      distance: 8,
      style: {
        stroke: "#ff4d4f",
        strokeOpacity: 0.65,
      },
    },
    autoFit: true,
    wave: { length: 128 },
    theme: { styleSheet: { brandColor: "#ff4d4f" } },
  }
  return <Liquid {...config} />
}

export default LiquidChart
