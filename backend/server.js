import express from "express"
import cors from "cors"
import users from "./api/route.js"
import fileRouter from "./api/route-files.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/users", users)

app.use('/api/v1/files', fileRouter);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app
