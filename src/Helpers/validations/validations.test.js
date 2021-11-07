import basicValidation, {
  validateOptionals,
  validateRequired,
  objectContainsNull,
  arrayContainsKey,
  validateEmail,
} from "."

test("[Helpers/validations] validateOptionals() with optionalKeys", () => {
  expect(
    validateOptionals(["address", "mobile"], {
      firstname: "Jonathan",
      lastname: "Quintana",
      address: "",
      mobile: "09064071",
    })
  ).toStrictEqual({
    firstname: "Jonathan",
    lastname: "Quintana",
    mobile: "09064071",
  })
})

test("[Helpers/validations] validateEmail() check if email is valid", () => {
  expect(
    validateEmail("username", { username: "jonathan@gmail.com" })
  ).toStrictEqual({ valid: true })
})

test("[Helpers/validations] validateEmail() check if email is invalid", () => {
  expect(
    validateEmail("username", { username: "jonathangmail.com" })
  ).toStrictEqual({ valid: false, errors: { username: "Invalid Email" } })
})
