import { Result } from "antd"
import MainButton from "Components/Commons/MainButton"
import React from "react"
import { useHistory } from "react-router-dom"

function URLNotFound() {
  const history = useHistory()
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "80vh",
        backgroundColor: "transparent",
        bottom: 0,
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <MainButton label="Back Home" onClick={() => history.push("/")} />
        }
      />
    </div>
  )
}

export default URLNotFound
