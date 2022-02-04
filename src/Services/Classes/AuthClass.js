import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@firebase/auth"
import UsersClass from "./UsersClass"

export default class AuthClass {
  static async login(email, password, branch, history) {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          UsersClass.updateDataById(email, {
            [this.BRANCH]: branch,
          })
          history.push("/")
          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          if (errorCode === "auth/user-not-found") {
            reject(errorCode)
          } else {
            console.log("errorcode", errorCode)
            if (errorCode === "auth/wrong-password") {
              reject("Invalid User")
            } else {
              reject(errorMessage)
            }
          }
        })
    })
  }

  static async createLogin(email, password, branch, history) {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          UsersClass.updateDataById(email, {
            [this.BRANCH]: branch,
          })
          history.push("/")
          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorMessage)
          reject(errorCode)
        })
    })
  }

  static async changePassword() {}

  static async logout(history) {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve("Logged Out")
          // history.push("/login")
        })
        .catch((error) => {
          reject(error)
          // An error happened.
        })
    })
  }

  static async checkEmailIfExist(username, password) {
    try {
      const user = await UsersClass.getDataById(username)
      if (user && password === "123456") {
        return "Email Exist"
      } else {
        return "Invalid User"
      }
    } catch (e) {
      return "Connection not available"
    }
  }
  static USERNAME = "username"
  static PASSWORD = "password"
  static BRANCH = "branchSelected"
  static RETYPE_PASSWORD = "reTypePassword"
  static PROPERTIES = [this.USERNAME, this.PASSWORD, this.BRANCH]
  static LABELS = {
    [this.USERNAME]: "Username",
    [this.PASSWORD]: "Password",
    [this.BRANCH]: "Branch",
    [this.RETYPE_PASSWORD]: "Retype Password",
  }
}
