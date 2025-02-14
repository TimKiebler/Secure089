import express from "express"
import UsersCtrl from "./users.controller.js"

const router = express.Router()

router.route("/register").post(UsersCtrl.apiRegisterUser)
router.route("/login").post(UsersCtrl.apiLoginUser)
router.route("/").get(UsersCtrl.apiGetUsers)

export default router
