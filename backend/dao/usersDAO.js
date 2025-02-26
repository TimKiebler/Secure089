import mongodb from "mongodb"

let users

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db("secure089").collection("users")
      console.log("Connected to users collection");
    } catch (e) {
      console.error(`Unable to establish collection: ${e}`)
    }
  }

static async addUser(firstName, lastName, email, password) {
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return { error: "Email already exists" };
    }

    const userDoc = {
      firstName,
      lastName,
      email,
      password,
      isAdmin: false,
      registrationStep: 1, // Mark as step 1
      additionalData: {}, // Initialize empty object for additional data
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await users.insertOne(userDoc);
  } catch (e) {
    console.error(`Unable to register user: ${e}`);
    return { error: e };
  }
}

static async updateUser(email, additionalData) {
  try {
    const updateDoc = {
      $set: {
        additionalData,
        registrationStep: 2, // Mark as step 2
        updatedAt: new Date(),
      },
    };

    return await users.updateOne({ email }, updateDoc);
  } catch (e) {
    console.error(`Unable to update user: ${e}`);
    return { error: e };
  }
}

  static async getUser(email) {
    try {
      return await users.findOne({ email })
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
