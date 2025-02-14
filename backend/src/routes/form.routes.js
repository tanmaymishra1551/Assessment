import express from "express"
import { createDetail, testController,checkData,getCompanyData } from "../controllers/form.controller.js"


const router = express.Router()

// Define routes
router.route("/test").get(testController)
router.route("/getCompanyData").get(getCompanyData)
router.route('/create').post(createDetail);
router.route('/check').post(checkData);
export default router
