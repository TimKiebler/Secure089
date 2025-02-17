import express from "express"
import UsersCtrl from "./users.controller.js"
import JobsCtrl from "./jobs.controller.js"

const router = express.Router()

router.route("/register").post(UsersCtrl.apiRegisterUser)
router.route("/register/complete").post(UsersCtrl.apiCompleteRegistration);
router.route("/login").post(UsersCtrl.apiLoginUser)
router.route("/me").get(UsersCtrl.apiGetUserData);
router.route("/").get(UsersCtrl.apiGetUsers)

router.route("/jobs/add").post(JobsCtrl.apiAddJob)
router.route("/jobs/delete").delete(JobsCtrl.apiDeleteJob)
router.route("/jobs/getAll").get(JobsCtrl.apiGetJobs)

export default router
