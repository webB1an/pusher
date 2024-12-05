import express from 'express'

import type { Router, Request, Response } from 'express'

import pusher from '../pusher'

const router: Router = express.Router()

router.get('/do', async(req: Request, res: Response) => {
  pusher.anniversary()
  pusher.wechat()
  res.json({
    success: true
  })
})

export default router
