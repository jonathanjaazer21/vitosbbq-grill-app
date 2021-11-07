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

      {loaded && children}
    </UnavailableContext.Provider>
  )
}

const Container = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        backgroundColor: "transparent",
        height: "90%",
        bottom: 0,
      }}
    >
      {children}
    </div>
  )
}

export default Unavailable
