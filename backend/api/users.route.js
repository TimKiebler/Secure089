import express from "express"
import UsersCtrl from "./users.controller.js"

const router = express.Router()

router.route("/register").post(UsersCtrl.apiRegisterUser)
router.route("/register/complete").post(UsersCtrl.apiCompleteRegistration);
router.route("/login").post(UsersCtrl.apiLoginUser)
router.route("/me").get(UsersCtrl.apiGetUserData);
router.route("/").get(UsersCtrl.apiGetUsers)

export default router
