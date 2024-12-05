import { CronJob } from 'cron'

import pusher from '../pusher'

export const job = new CronJob(
  '0 30 7 * * *', // cronTime
  function() {
    console.log('执行了')
    console.log(process.env.APP_ID)
    pusher.anniversary()
    pusher.wechat()
  }, // onTick
  null, // onComplete
  false, // start
  'Asia/Shanghai' // timeZone
)
