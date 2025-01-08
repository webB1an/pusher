import crypto from 'crypto'
import dayjs from 'dayjs'
import axios from 'axios'
import { Lunar } from 'lunar-typescript'
import { calculateAge, getHitokoto } from '../utils'
import { getLunarExpectInterval } from '../utils/lunar'

export function getCrypto(json: string) {
  // 固定的密钥和 IV（必须是 16 字节）
  const key = process.env.BARK_PUSH_KEY as string
  const iv = process.env.BARK_PUSH_IV as string
  const keyBuffer = Buffer.from(key, 'ascii')
  const ivBuffer = Buffer.from(iv, 'ascii')

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer)
  let encrypted = cipher.update(json, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const ciphertext = Buffer.from(encrypted, 'hex').toString('base64')

  return {
    ciphertext,
    iv
  }
}

function getLunarJson(lunar: string) {
  // example: '2023-07-08'
  const arr = lunar.split('-')
  return {
    year: arr[0],
    month: arr[1],
    day: arr[2]
  }
}

export function getLunarExpectSolar(lunar: string) {
  const nowYear = dayjs().get('year')
  const { month, day } = getLunarJson(lunar)
  return Lunar.fromYmd(nowYear, Number(month), Number(day)).getSolar().toString()
}

export async function getAnniversary() {
  const now = dayjs()
  const meetDate = dayjs(process.env.MEET_DATE)
  const cardDate = dayjs(process.env.CARD_DATE)
  const marryDate = dayjs(process.env.MARRY_DATE)
  const childDate = dayjs(process.env.CHILD_DATE)
  const hitokoto = await getHitokoto()
  const sentence = hitokoto || '一叶见秋起，半天卷云舒。'

  const meet = now.diff(meetDate, 'day') // 相识
  const card = now.diff(cardDate, 'day') // 领证
  const marry = now.diff(marryDate, 'day') // 结婚

  const nowYear = dayjs().get('year')

  const meetMonth = dayjs(meetDate).get('month') + 1
  const meetDay = dayjs(meetDate).date()

  const cardMonth = dayjs(cardDate).get('month') + 1
  const cardDay = dayjs(cardDate).date()

  const marryMonth = dayjs(marryDate).get('month') + 1
  const marryDay = dayjs(marryDate).date()

  const childMonth = dayjs(childDate).get('month') + 1
  const childDay = dayjs(childDate).date()

  const meetExpect = dayjs(`${nowYear}-${meetMonth}-${meetDay}`)
  const meetInterval = meetExpect.isSame(now, 'day') ? 0 : (meetExpect.isAfter(now) ? meetExpect.diff(now, 'day') : dayjs(meetExpect.add(1, 'year')).diff(now, 'day'))

  const cardExpect = dayjs(`${nowYear}-${cardMonth}-${cardDay}`)
  const cardInterval = cardExpect.isSame(now, 'day') ? 0 : (cardExpect.isAfter(now) ? cardExpect.diff(now, 'day') : dayjs(cardExpect.add(1, 'year')).diff(now, 'day'))

  const marryExpect = dayjs(`${nowYear}-${marryMonth}-${marryDay}`)
  const marryInterval = marryExpect.isSame(now, 'day') ? 0 : (marryExpect.isAfter(now) ? marryExpect.diff(now, 'day') : dayjs(marryExpect.add(1, 'year')).diff(now, 'day'))

  const childExpect = dayjs(`${nowYear}-${childMonth}-${childDay}`)
  const childInterval = childExpect.isSame(now, 'day') ? 0 : (childExpect.isAfter(now) ? childExpect.diff(now, 'day') : dayjs(childExpect.add(1, 'year')).diff(now, 'day'))

  return {
    meet,
    card,
    marry,
    child: calculateAge(childDate),
    meetInterval,
    cardInterval,
    marryInterval,
    childInterval,
    sentence
  }
}

export async function getPushJson() {
  const {
    meet,
    card,
    marry,
    child,
    // meetInterval,
    cardInterval,
    marryInterval,
    // childInterval,
    sentence
  } = await getAnniversary()

  const PENTA_LUNAR_DATE = process.env.PENTA_LUNAR_DATE as string
  const JUNE_LUNAR_DATE = process.env.JUNE_LUNAR_DATE as string
  const CHILD_LUNAR_DATE = process.env.CHILD_LUNAR_DATE as string

  const penta = getLunarExpectInterval(PENTA_LUNAR_DATE)
  const pentaTxt = penta === 0 ? '今天是 Penta 生日啦' : (penta < 1 ? '🎂Penta 的生日即将到啦🎂' : `Penta 生日还有：${Math.floor(penta)}天`)

  const june = getLunarExpectInterval(JUNE_LUNAR_DATE)
  const juneTxt = june === 0 ? '今天是 June 生日啦' : (june < 1 ? '🎂June 的生日即将到啦🎂' : `June 生日还有：${Math.floor(june)}天`)

  const autumn = getLunarExpectInterval(CHILD_LUNAR_DATE)
  const autumnTxt = autumn === 0 ? '今天是 Autumn 生日啦' : (autumn < 1 ? '🎂Autumn 的生日即将到啦🎂' : `Autumn 生日还有：${Math.floor(autumn)}天`)

  const jsonString = JSON.stringify({
    title: '早上好呀！',
    body: `相识已经：${meet}天
领证已经：${card}天
结婚已经：${marry}天
孩子已经：${child}天

领证纪念日还有：${cardInterval}天
结婚纪念日还有：${marryInterval}天
${pentaTxt}
${juneTxt}
${autumnTxt}

一言：${sentence}`,
    icon: 'https://s2.loli.net/2024/11/29/hHZ8gNOQvuTIdC4.png',
    group: 'daily'
  })

  return jsonString
}

export async function getCryptoParams() {
  const jsonString = await getPushJson()
  const { ciphertext, iv } = getCrypto(jsonString)
  return {
    ciphertext,
    iv
  }
}

export function pushMsg(deviceKey:string, ciphertext:string, iv: string) {
  return new Promise(resolve => {
    axios.post(`https://api.day.app/${deviceKey}`, {
      ciphertext,
      iv
    })
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
  })
}
