import express from 'express'
import type { Router } from 'express'
import pusher from './pusher'
const router: Router = express.Router()

router.use('/pusher', pusher)

export default router
