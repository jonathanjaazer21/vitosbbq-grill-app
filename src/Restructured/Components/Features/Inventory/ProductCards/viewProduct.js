import { Button } from "antd"
import React, { useState } from "react"
import useProductServices from "./useProductServices"

function ViewProduct({ code }) {
  const { getPurchasedProducts, totalStorage } = useProductServices()
  const style = {
    height: "10rem",
    maxHeight: "10rem",
    display: "flex",
    justifyContent: "center",
    fontSize: "5rem",
  }
  const [isClicked, setIsClicked] = useState(false)

  const Storage = () => {
    return (
      <div style={{ position: "relative" }}>
        <h5>{totalStorage}</h5>
        <Button
          style={{ position: "absolute", left: "1rem" }}
          onClick={handleStorage}
        >
          Refresh
        </Button>
      </div>
    )
  }

  const handleStorage = () => {
    setIsClicked(true)
    getPurchasedProducts(code)
  }
  return (
    <div style={style}>
      {isClicked ? (
        <Storage />
      ) : (
        <Button onClick={handleStorage}>View Storage</Button>
      )}
    </div>
  )
}

export default ViewProduct
