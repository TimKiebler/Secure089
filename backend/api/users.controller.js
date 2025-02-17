import UsersDAO from "../dao/usersDAO.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const SECRET_KEY = process.env['JWT_SECRET'];

export default class UsersController {

  static async apiRegisterUser(req, res) {
    try {
      const {firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userResponse = await UsersDAO.addUser(firstName, lastName, email, hashedPassword);

      if (userResponse.error) {
        return res.status(400).json({ error: userResponse.error });
      }

      res.json({ status: "success", message: "Step 1 completed. Proceed to step 2." });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiCompleteRegistration(req, res) {
    try {
      const { email, phoneNumber, address, dateOfBirth, profilePicture, bio } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const additionalData = {
        phoneNumber,
        address,
        dateOfBirth,
        profilePicture,
        bio,
      };

      const updateResponse = await UsersDAO.updateUser(email, additionalData);

      if (updateResponse.error) {
        return res.status(400).json({ error: updateResponse.error });
      }

      res.json({ status: "success", message: "Registration completed successfully." });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiLoginUser(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" })
      }

      const user = await UsersDAO.getUser(email)
      if (!user) {
        return res.status(401).json({ error: "User not found" })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ token, email })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetUserData(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Extract token from header
      const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
      const email = decoded.email; // Get the email from the token payload
  
      const user = await UsersDAO.getUser(email); // Fetch user data
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user); // Return the user data
    } catch (e) {
      res.status(500).json({ error: e.message });
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
