import React, { useEffect, useState } from "react"
import GoogleButton from "react-google-button"
import Animate, {
  RollIn,
  FadeIn,
  FadeInDown,
  ZoomIn,
  FadeInUp,
  RubberBand,
} from "animate-css-styled-components"
import { auth, provider } from "services/firebase"
import {
  Wrapper,
  Background,
  GoogleContainer,
  Card,
  CookedChef,
  Description,
  VitosLogo,
} from "./styles"
import background from "images/background2.jpg"
import cookedChefLogo from "images/cookedChef.jpg"
import vitosLogo from "images/vitosLogo.jpg"
import { getData, updateData } from "services"
import { Button, Divider, Input, Select } from "antd"
import validateEmail from "Restructured/Utilities/validateEmail"
import { useDispatch, useSelector } from "react-redux"
import { selectUserSlice } from "./loginSlice"
import { setBranchSelected } from "containers/0.login/loginSlice"
import { PuffLoader } from "react-spinners"
const { Option } = Select

function NewLogin() {
  const dispatch = useDispatch()
  const userSlice = useSelector(selectUserSlice)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const [enableChangePass, setEnableChangePass] = useState(false)
  const [branchList, setBranchList] = useState([])
  const handleLogin = () => {
    // auth
    //   .signInWithPopup(provider)
    //   .then((result) => {
    //     /** @type {firebase.auth.OAuthCredential} */
    //     const credential = result.credential
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     var token = credential.accessToken
    //     // The signed-in user info.
    //     var user = result.user
    //     // ...
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     var errorCode = error.code
    //     var errorMessage = error.message
    //     // The email of the user's account used.
    //     var email = error.email
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential
    //     // ...
    //   })

    if (
      credentials.password.length >= 6 &&
      validateEmail(credentials.email) &&
      userSlice?.branchSelected
    ) {
      const { email, password } = credentials
      setLoading(true)
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCred) => {
          // proceed if user already existed
          console.log("userCred", userCred.user)
          updateData({
            data: { branchSelected: userSlice.branchSelected },
            collection: "users",
            id: credentials?.email,
          })
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          if (errorCode === "auth/user-not-found") {
            // proceed if user not found
            checkEmailIfListed(email, password)
          } else {
            if (
              errorMessage ===
              "The password is invalid or the user does not have a password."
            ) {
              setErrorMessage("Invalid User")
            } else {
              setErrorMessage(errorMessage)
            }
            console.log("errorMessage", errorMessage)
          }
          setLoading(false)
        })
    } else {
      console.log("wala")
    }
  }

  const checkEmailIfListed = async (email, password) => {
    const data = await getData("users", email)
    if (data?.isEnabled && password === "123456") {
      setEnableChangePass(true)
    } else {
      setEnableChangePass(false)
      setErrorMessage("Invalid User")
    }
  }

  const setBranchesList = async (email) => {
    if (email) {
      const data = await getData("users", email)
      if (data) {
        setBranchList([...data?.branches])
      } else {
        setBranchList([])
        dispatch(setBranchSelected(""))
      }
    }
  }

  const handleSignUp = () => {
    if (errorMessage) {
      return
    }
    if (credentials?.email && credentials?.newPass) {
      const { email, newPass } = credentials

      if (!validateEmail(email)) {
        setErrorMessage("The email you entered is invalid")
        return
      }

      setLoading(true)
      auth
        .createUserWithEmailAndPassword(email, newPass)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user
          updateData({
            data: { branchSelected: userSlice.branchSelected },
            collection: "users",
            id: credentials?.email,
          })
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          setLoading(false)
          // ..
        })
    }
  }

  useEffect(() => {
    return () => {
      setErrorMessage("")
      setEnableChangePass(false)
      setCredentials({})
      dispatch(setBranchSelected(""))
    }
  }, [])
  return (
    <Wrapper>
      {/* <Background src={background} /> */}
      <Animate Animation={[FadeInDown]} duration={["1s"]} delay={["0.1s"]}>
        <div style={{ display: "flex" }}>
          <Card>
            <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.8s"]}>
              <CookedChef src={cookedChefLogo} />
            </Animate>
            <Animate Animation={[RollIn]} duration={["1s"]} delay={["0.5s"]}>
              <VitosLogo src={vitosLogo} />
            </Animate>
            {/* <Animate Animation={[FadeInUp]} duration={[".1s"]} delay={["1.2s"]}>
              <Description>USER LOGIN</Description>
            </Animate> */}
            <Animate
              Animation={[ZoomIn, RubberBand]}
              duration={[".1s", "1s"]}
              delay={["0.8s", "1.5s"]}
            >
              {/* <GoogleContainer>
                <GoogleButton onClick={handleLogin} type="light" />
              </GoogleContainer> */}
            </Animate>
          </Card>

          <Card>
            <div style={{ padding: "0rem 3rem", position: "relative" }}>
              <Animate
                Animation={[FadeInUp]}
                duration={[".1s"]}
                delay={["1.2s"]}
              >
                <h1 style={{ textAlign: "center" }}>USER LOGIN</h1>
              </Animate>
              <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.8s"]}>
                <Input
                  placeholder="Email"
                  size="large"
                  style={{ marginBottom: "1rem" }}
                  onChange={(e) => {
                    setCredentials({
                      ...credentials,
                      email: e.target.value || "",
                    })
                    setBranchesList(e.target.value)
                    setErrorMessage("")
                  }}
                />
                <Input
                  placeholder="Password"
                  style={{ marginBottom: "1rem" }}
                  type="password"
                  size="large"
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value })
                    setErrorMessage("")
                  }}
                />
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={userSlice?.branchSelected}
                  onChange={(value) => {
                    dispatch(setBranchSelected(value))
                  }}
                >
                  {branchList.map((data) => {
                    return <Option value={data}>{data}</Option>
                  })}
                </Select>
                <Divider />
                {/* end boundary of email and password credentials * ----------------------------------------------------------------------------------------------->>>>/}

                {/* Retype password */}
                {enableChangePass && (
                  <div>
                    <Input
                      placeholder="New password"
                      size="large"
                      style={{ marginBottom: "1rem" }}
                      type="password"
                      onChange={(e) => {
                        if (e.target.value.length >= 6) {
                          if (e.target.value !== credentials.reType) {
                            setErrorMessage("Password mismatch")
                          } else {
                            setErrorMessage("")
                          }
                        } else {
                          setErrorMessage(
                            "Password must be at least 6 characters"
                          )
                        }

                        setCredentials({
                          ...credentials,
                          newPass: e.target.value,
                        })
                      }}
                    />
                    <Input
                      placeholder="Re-type password"
                      type="password"
                      size="large"
                      onChange={(e) => {
                        if (e.target.value !== credentials.newPass) {
                          setErrorMessage("Password mismatch")
                        } else {
                          setErrorMessage("")
                        }

                        if (credentials?.newPass.length < 6) {
                          setErrorMessage(
                            "Password must be at least 6 characters"
                          )
                        }
                        setCredentials({
                          ...credentials,
                          reType: e.target.value,
                        })
                      }}
                    />
                  </div>
                )}
                <Divider />
                {enableChangePass === false ? (
                  <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    disabled={
                      !(
                        (credentials.password || 0).length >= 6 &&
                        validateEmail(credentials.email) &&
                        userSlice?.branchSelected
                      ) || loading
                    }
                    onClick={handleLogin}
                  >
                    {loading ? <PuffLoader size={30} /> : "LOGIN"}
                  </Button>
                ) : (
                  // this is for retype password buttons ------------------------------------------------------------------------------------------>>>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      size="large"
                      style={{ flex: 1 }}
                      onClick={handleSignUp}
                      disabled={loading}
                    >
                      {loading ? <PuffLoader size={30} /> : "SAVE"}
                    </Button>
                    <Button
                      size="large"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setEnableChangePass(false)
                        setErrorMessage("")
                      }}
                    >
                      CANCEL
                    </Button>
                  </div>
                )}
                {/* end of retype password boundary */}
              </Animate>
              <div
                style={{
                  position: "absolute",
                  textAlign: "center",
                  width: "100%",
                  left: 0,
                  color: "red",
                }}
              >
                {errorMessage}
              </div>
            </div>
          </Card>
        </div>
      </Animate>
    </Wrapper>
  )
}

export default NewLogin
