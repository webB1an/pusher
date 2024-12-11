import express from 'express'
import type { Router } from 'express'
import pusher from './pusher'
import eat from './eat'
const router: Router = express.Router()

router.use('/pusher', pusher)
router.use('/eat', eat)

export default router
