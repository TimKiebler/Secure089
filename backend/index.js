import app from "./server.js"
import mongodb from "mongodb"
import UsersDAO from "./dao/usersDAO.js"
import JobsDAO from "./dao/jobsDAO.js"
import dotenv from "dotenv"

dotenv.config();

const MongoClient = mongodb.MongoClient

const mongo_username = process.env['MONGO_USERNAME']
const mongo_password = process.env['MONGO_PASSWORD']

console.log(mongo_username);

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@securemitarbeiterportal.3gjzs.mongodb.net/?retryWrites=true&w=majority&appName=SecureMitarbeiterportal`


const port = process.env['PORT']

MongoClient.connect(uri, { maxPoolSize: 50, wtimeoutMS: 2500, useNewUrlParser: true })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await UsersDAO.injectDB(client)
    await JobsDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`Listening on port ${port}`)
    })
  })
