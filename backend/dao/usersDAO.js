import mongodb from "mongodb"

let users

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db("secure089").collection("users")
    } catch (e) {
      console.error(`Unable to establish collection: ${e}`)
    }
  }

  static async addUser(username, password) {
    try {
      const existingUser = await users.findOne({ username })
      if (existingUser) {
        return { error: "Username already exists" }
      }

      const userDoc = { username, password }
      return await users.insertOne(userDoc)
    } catch (e) {
      console.error(`Unable to register user: ${e}`)
      return { error: e }
    }
  }

  static async getUser(username) {
    try {
      return await users.findOne({ username })
    } catch (e) {
      console.error(`Unable to get user: ${e}`)
      return { error: e }
    }
  }

  static async getAllUsers() {
    try {
      return await users.find().toArray()
    } catch (e) {
      console.error(`Unable to get users: ${e}`)
      return { error: e }
    }
  }
}
