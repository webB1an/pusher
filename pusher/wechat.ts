// 企业微信机器人推送
import axios from 'axios'
import { getAnniversary } from '../utils/pusher'
import { getLocation, getNowWeather, getWeatherIndices } from '../utils/weather'
import { getLunarExpectInterval } from '../utils/lunar'
export async function wechat() {
  const location = ['蚌埠', '杭州']
  const weatherTxt = []
  for (const city of location) {
    const location = await getLocation(city)
    const weather = await getNowWeather(location.id)

    const indices = await getWeatherIndices(location.id)

    weatherTxt.push(`${city}：${weather.text}，${weather.temp}度，体感温度：${weather.feelsLike}度，${weather.windDir}${weather.windScale}级\n${indices.category}，${indices.text}`)
  }

  const {
    meet,
    card,
    marry,
    child,
    // meetInterval,
    // childInterval,
    cardInterval,
    marryInterval,
    sentence
  } = await getAnniversary()

  const PENTA_LUNAR_DATE = process.env.PENTA_LUNAR_DATE as string
  const JUNE_LUNAR_DATE = process.env.JUNE_LUNAR_DATE as string
  const CHILD_LUNAR_DATE = process.env.CHILD_LUNAR_DATE as string

  const penta = getLunarExpectInterval(PENTA_LUNAR_DATE)
  const pentaTxt = penta === 0 ? '今天是 Penta 生日啦' : (penta < 1 ? '🎂Penta 的生日即将到啦🎂' : `Penta 生日还有：${penta}天`)

  const june = getLunarExpectInterval(JUNE_LUNAR_DATE)
  const juneTxt = june === 0 ? '今天是 June 生日啦' : (june < 1 ? '🎂June 的生日即将到啦🎂' : `June 生日还有：${june}天`)

  const autumn = getLunarExpectInterval(CHILD_LUNAR_DATE)
  const autumnTxt = autumn === 0 ? '今天是 Autumn 生日啦' : (autumn < 1 ? '🎂Autumn 的生日即将到啦🎂' : `Autumn 生日还有：${autumn}天`)

  const data = {
    msgtype: 'text',
    text: {
      content: `早安！

相识已经：${meet}天
领证已经：${card}天
结婚已经：${marry}天
孩子已经：${child}天

领证纪念日还有：${cardInterval}天
结婚纪念日还有：${marryInterval}天
${pentaTxt}
${juneTxt}
${autumnTxt}

${weatherTxt.join('\n\n')}

一言：${sentence}`
    }
  }

  const WECHAT_PUSH_KEY = process.env.WECHAT_PUSH_KEY

  axios({
    method: 'post',
    url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WECHAT_PUSH_KEY}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
    .then(function(response) {
      console.log(response.data)
    })
    .catch(function(error) {
      console.error('Error:', error)
    })
}
