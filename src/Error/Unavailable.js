import React, { createContext, useEffect, useState } from "react"
import { Spin, Result } from "antd"
import MainButton from "Components/Commons/MainButton"
import { useLocation, useHistory } from "react-router"

export const UnavailableContext = createContext({})
function Unavailable({ children }) {
  const location = useLocation()
  const history = useHistory()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(true)

  // cleared the error if the routes changes to render the component requested
  useEffect(() => {
    if (error) {
      setError("")
      setLoaded(true)
    }
  }, [location.pathname])

  const reloadPage = () => {
    history.push("/")
  }
  return (
    <UnavailableContext.Provider value={{ setError, setIsLoading, setLoaded }}>
      <div
        style={
          isLoading || error
            ? {
                height: "85vh",
                overflow: "hidden",
              }
            : {}
        }
      >
        {isLoading && (
          <Container>
            <Spin size="large" />
          </Container>
        )}

        {error && isLoading === false && (
          <Container>
            <Result
              status="500"
              title="500"
              subTitle={error}
              extra={<MainButton label="Back Home" onClick={reloadPage} />}
            />
          </Container>
        )}

        {children}
      </div>
    </UnavailableContext.Provider>
  )
}

const Container = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
      }}
    >
      {children}
    </div>
  )
}

export default Unavailable
