import express from 'express'
import * as http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import type { Express } from 'express'
import type { Server } from 'http'
import router from './routes'

import { job } from './cron'
import { logWithTime } from './utils'

// if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
//   dotenv.config({ path: './dev.env' })
// } else {
//   dotenv.config({ path: './prod.env' })
// }

dotenv.config({ path: './dev.env' })

logWithTime('====================================================================')
logWithTime('BARK_PUSH_KEY', process.env.BARK_PUSH_KEY as string)
logWithTime('BARK_PUSH_IV', process.env.BARK_PUSH_IV as string)
logWithTime('====================================================================')

const app: Express = express()
const server: Server = http.createServer(app)
const port = 3982

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

job.start()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log('---------------server is running at port: ---------------', port)
})
