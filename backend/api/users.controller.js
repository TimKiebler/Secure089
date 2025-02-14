import UsersDAO from "../dao/usersDAO.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env['JWT_SECRET'];

export default class UsersController {
  static async apiRegisterUser(req, res) {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const userResponse = await UsersDAO.addUser(username, hashedPassword)

      if (userResponse.error) {
        return res.status(400).json({ error: userResponse.error })
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiLoginUser(req, res) {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" })
      }

      const user = await UsersDAO.getUser(username)
      if (!user) {
        return res.status(401).json({ error: "User not found" })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ token })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetUsers(req, res) {
    try {
      const users = await UsersDAO.getAllUsers()
      res.json(users)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}
