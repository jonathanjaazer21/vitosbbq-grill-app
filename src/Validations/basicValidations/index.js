export const modifiedValidation = (ServiceClass, data = {}) => {
  const properties = [...ServiceClass.PROPERTIES]
  for (const key in data) {
    if (!properties.includes(key)) {
    }
  }
}
export const addValidation = (ServiceClass, data = {}) => {}
