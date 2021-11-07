import validateAuth from "."

test("[Validations/validateAuth] validateAuth() with null password", () => {
  expect(validateAuth({ username: "jonathan", password: "" })).toStrictEqual({
    valid: false,
    error: "password",
    message: "This is required",
  })
})

test("[Validations/validateAuth] validateAuth() without password property", () => {
  expect(validateAuth({ username: "jonathan" })).toStrictEqual({
    valid: false,
    error: "password",
    message: "This is required",
  })
})

test("[Validations/validateAuth] validateAuth() with null username", () => {
  expect(validateAuth({ username: "", password: "654321" })).toStrictEqual({
    valid: false,
    error: "username",
    message: "This is required",
  })
})

test("[Validations/validateAuth] validateAuth() without username property", () => {
  expect(validateAuth({ password: "654321" })).toStrictEqual({
    valid: false,
    error: "username",
    message: "This is required",
  })
})

test("[Validations/validateAuth] validateAuth() without null values", () => {
  expect(
    validateAuth({ username: "jonathan", password: "654321" })
  ).toStrictEqual({
    valid: true,
  })
})
