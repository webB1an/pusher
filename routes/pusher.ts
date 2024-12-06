import express from 'express'

import type { Router, Request, Response } from 'express'

import pusher from '../pusher'

import { getLunarExpectInterval } from '../utils/lunar'

const router: Router = express.Router()

router.get('/do', async(req: Request, res: Response) => {
  pusher.anniversary()
  pusher.wechat()
  res.json({
    success: true
  })
})

router.get('/test', async(req: Request, res: Response) => {
  const t = getLunarExpectInterval('2024-11-08')
  console.log(t)
  res.json({
    success: true
  })
})

export default router
