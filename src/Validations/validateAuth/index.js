import {
  basicValidation,
  validateEmail,
  validateMaxChar,
} from "Helpers/validations"
import AuthClass from "Services/Classes/AuthClass"

export default (data) => {
  let validationResponse = { valid: true, errors: {} }
  const optionals = [] // list of optional properties
  const basicData = basicValidation(AuthClass, data, optionals)
  const validateUsername = validateEmail(AuthClass.USERNAME, data)
  const validatePassword = validateMaxChar(AuthClass.PASSWORD, data, 6)
  if (!basicData.valid) {
    return { ...validationResponse, ...basicData }
  }

  if (!validateUsername.valid) {
    validationResponse = { ...validationResponse, ...validateUsername }
  }

  if (!validatePassword.valid) {
    validationResponse = { ...validationResponse, ...validatePassword }
  }
  return validationResponse
}
