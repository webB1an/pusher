import express from 'express'
import { getRandomElement } from '../utils'
import type { Router, Request, Response } from 'express'

const router: Router = express.Router()

router.get('/what', async(req: Request, res: Response) => {
  const menu = [
    '土豆烧肉',
    '红烧肉',
    '红烧排骨',
    '糖醋排骨',
    '排骨玉米汤',
    '冬瓜烧肉',
    '萝卜烧肉炖粉丝',
    '辣椒炒蛋',
    '西红柿炒蛋',
    '蒜苔炒肉',
    '花菜烧肉',
    '鲈鱼',
    '虾',
    '羊肉汤',
    '红烧猪蹄',
    '豆芽烧肉'
  ]
  res.send(getRandomElement(menu))
})

export default router
