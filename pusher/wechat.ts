import axios from 'axios'
import { getAnniversary } from '../utils/pusher'
import { getLocation, getNowWeather, getWeatherIndices } from '../utils/weather'
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
    childInterval,
    cardInterval,
    marryInterval,
    sentence
  } = await getAnniversary()

  const data = {
    msgtype: 'text',
    text: {
      content: `早安！

相识已经：${meet}
领证已经：${card}
结婚已经：${marry}
孩子已经：${child}

领证纪念日还有：${cardInterval}
结婚纪念日还有：${marryInterval}
孩子生日还有：${childInterval}

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
