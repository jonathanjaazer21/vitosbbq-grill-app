import { useContext, useEffect, useState } from "react"
import validateAuth from "Validations/validateAuth"
import { message } from "antd"
import AuthClass from "Services/Classes/AuthClass"
import UsersClass from "Services/Classes/UsersClass"
import { useHistory } from "react-router-dom"
import { UnauthorizedContext } from "Error/Unauthorized"
export default function useAuthentication() {
  const { user, setUser } = useContext(UnauthorizedContext)
  const history = useHistory()
  const [data, setData] = useState({})
  const [response, setResponse] = useState({})
  const [branches, setBranches] = useState([])
  const [enableChangePass, setEnabledChangePass] = useState(false)

  useEffect(() => {
    if (!response?.valid) {
      for (const key in response.errors) {
        message.error(`${AuthClass.LABELS[key]}: ${response.errors[key]}`)
      }
    }
  }, [response])

  useEffect(() => {
    loadUser(data[AuthClass.USERNAME])
    setData({ ...data, [AuthClass.BRANCH]: "" })
  }, [data[AuthClass.USERNAME]])

  const loadUser = async (email) => {
    try {
      const user = await UsersClass.getDataById(email)
      if (user) {
        setBranches(user.branches)
      }
    } catch (e) {
      message.error("Connection not available")
      console.log("Authentication hook", e?.message)
    }
  }

  const handleChange = (value, fieldName) => {
    setData({ ...data, [fieldName]: value })
  }
  const handleCancel = () => {
    const _data = { ...data }
    delete _data[AuthClass.RETYPE_PASSWORD]
    setData({ ..._data, [AuthClass.PASSWORD]: "" })

    setEnabledChangePass(false)
  }

  const onSubmit = async () => {
    const validatedData = validateAuth(data)
    setResponse(validatedData)
    if (validatedData.valid) {
      message.loading({ content: "Loading...", key: "updatable", duration: 10 })
      try {
        const result = await AuthClass.login(
          data[AuthClass.USERNAME],
          data[AuthClass.PASSWORD],
          data[AuthClass.BRANCH],
          history
        )
        if (result) {
          setUser({ ...user, [AuthClass.BRANCH]: data[AuthClass.BRANCH] })
          message.success({
            content: "Logged In",
            key: "updatable",
            duration: 2,
          })
        }
      } catch (error) {
        if (error === "auth/user-not-found") {
          const result = await AuthClass.checkEmailIfExist(
            data[AuthClass.USERNAME],
            data[AuthClass.PASSWORD]
          )
          if (result === "Email Exist") {
            setEnabledChangePass(true)
            setData({ ...data, [AuthClass.PASSWORD]: "" })
            message.destroy("updatable")
            message.info("Please change your password to proceed")
          } else {
            message.destroy("updatable")
            message.error(result)
          }
        } else {
          message.destroy("updatable")
          message.error(error)
        }
      }
    }
  }

  const onSignup = async () => {
    const _newData = { ...data }
    if (data[AuthClass.PASSWORD] !== data[AuthClass.RETYPE_PASSWORD]) {
      message.error("Password mismatch")
      return
    }
    delete _newData[AuthClass.RETYPE_PASSWORD]
    const validatedData = validateAuth(_newData)
    setResponse(validatedData)
    if (validatedData.valid) {
      message.loading({ content: "Loading...", key: "updatable", duration: 10 })
      try {
        const result = await AuthClass.createLogin(
          _newData[AuthClass.USERNAME],
          _newData[AuthClass.PASSWORD],
          _newData[AuthClass.BRANCH],
          history
        )
        if (result) {
          message.success({
            content: "Logged In",
            key: "updatable",
            duration: 2,
          })
        }
      } catch (error) {
        message.destroy("updatable")
        message.error(error)
      }
    }
  }
  return {
    data,
    branches,
    handleChange,
    onSubmit,
    onSignup,
    enableChangePass,
    handleCancel,
  }
}
