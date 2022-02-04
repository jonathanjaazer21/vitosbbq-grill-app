// check if the properties of the data object is in the array of strings otherwise false if not
export const arrayContainsKey = (
  array = [], //array of strings
  data = {}
) => {
  const errors = {}
  for (const key in data) {
    if (!array.includes(key)) {
      errors[key] = "Invalid key"
    }
  }
  return errors
}

// check if the object properties contains a value otherwise false if null
export const objectContainsNull = (data = {}) => {
  const errors = {}
  for (const key in data) {
    if (data[key].trim() === "") {
      errors[key] = "This is required"
    }
  }
  return errors
}

// remove key from the data object. If it is optional key and contains null it will be included
export const validateOptionals = (
  optionalKeys = [], //array of strings
  data = {}
) => {
  const newData = { ...data }
  for (const key in data) {
    if (optionalKeys.includes(key)) {
      if (data[key].trim() === "") {
        delete newData[key]
      }
    }
  }
  return newData
}

// add key if it is not stated in an object and is required
export const validateRequired = (
  array = [], //array of strings (required keys)
  data = {}
) => {
  const newData = { ...data }
  for (const key of array) {
    if (typeof newData[key] === "undefined") {
      newData[key] = ""
    }
  }
  return newData
}

export const validateMaxChar = (fieldName, data, max = 10) => {
  if (typeof data[fieldName] !== "undefined") {
    if (data[fieldName].length < max) {
      return {
        valid: false,
        errors: { [fieldName]: `Must be at least ${max} characters required` },
      }
    }
  }
  return { valid: true }
}

export const validateEmail = (fieldName, data) => {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (typeof data[fieldName] !== "undefined") {
    const validate = res.test(String(data[fieldName]).toLowerCase())
    if (!validate) {
      return {
        valid: false,
        errors: { [fieldName]: `Invalid Email` },
      }
    }
  }
  return { valid: true }
}

// check if properties are valid, remove optional fields with null values and check if data contains null
export const basicValidation = (ServiceClass, data, optionals = []) => {
  const ifArrayContainsKey = arrayContainsKey(ServiceClass.PROPERTIES, data)
  const validatedRequired = validateRequired(ServiceClass.PROPERTIES, data)
  const validatedOptionals = validateOptionals(optionals, validatedRequired)
  const isNull = objectContainsNull(validatedOptionals)

  if (Object.keys(ifArrayContainsKey).length > 0) {
    return { valid: false, errors: ifArrayContainsKey }
  }

  if (Object.keys(isNull).length > 0) {
    return { valid: false, errors: isNull }
  }

  return { valid: true }
}

export default validateOptionals
