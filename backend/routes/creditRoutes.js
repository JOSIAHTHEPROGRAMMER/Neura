import express from "express"
import { getPlans, purchasePlan } from "../controllers/creditController.js"
import { protectRoute } from "../middleware/auth.js"

const creditRouter = express.Router()

creditRouter.get('/plan', getPlans)
creditRouter.post('/purchase', protectRoute, purchasePlan)

export default creditRouter