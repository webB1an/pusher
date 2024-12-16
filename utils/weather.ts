import axios from 'axios'
import type { Location, NowWeatherData, Indices } from '../types'

// 根据城市名称获取城市 ID
export function getLocation(city: string): Promise<Location> {
  return new Promise((resolve) => {
    const key = process.env.WEATHER_KEY
    axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${key}`)
      .then((res) => {
        if (res.data.location && res.data.location.length > 0) { resolve(res.data.location[0] as unknown as Location) } else { resolve({ id: '101210101', name: '杭州', lat: '30.24603', lon: '120.21079' }) }
      })
  })
}

// 根据城市 ID 获取天气
export function getNowWeather(location: string): Promise<NowWeatherData> {
  return new Promise((resolve) => {
    const key = process.env.WEATHER_KEY
    axios.get(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=${key}`)
      .then((res) => {
        resolve(res.data.now as unknown as NowWeatherData)
      }).catch(() => {
        resolve({
          obsTime: '',
          temp: '',
          feelsLike: '',
          icon: '',
          text: '',
          wind360: '',
          windDir: '',
          windScale: '',
          windSpeed: '',
          humidity: '',
          precip: '',
          pressure: '',
          vis: '',
          cloud: '',
          dew: ''
        })
      })
  })
}

// 获取天气指数
export function getWeatherIndices(location: string): Promise<Indices> {
  return new Promise((resolve) => {
    const key = process.env.WEATHER_KEY
    axios.get(`https://devapi.qweather.com/v7/indices/1d?type=3&location=${location}&key=${key}`)
      .then((res) => {
        if (res.data.daily && res.data.daily.length > 0) { resolve(res.data.daily[0] as unknown as Indices) } else { resolve({ date: '', type: '', name: '', level: '', category: '', text: '' }) }
      })
  })
}
