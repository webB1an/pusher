import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { Lunar } from 'lunar-typescript'

dayjs.extend(relativeTime)
  .locale('zh-cn')

function getLunarJson(lunar: string) {
  // example: '2023-07-08'
  const arr = lunar.split('-')
  return {
    year: arr[0],
    month: arr[1],
    day: arr[2]
  }
}

// 获取农历纪念日与今日的间隔
// 如纪念日是农历 6-30
// 如果今天是农历 6-30，则返回 0
// 如果今天是农历 6-28，则返回 2
// 如果今天是农历 7-01，代表今年的纪念日已过，则返回 365
export function getLunarExpectInterval(lunar: string) {
  const now = dayjs()
  const nowYear = dayjs().get('year')
  // 获取农历的年月日
  const { month, day } = getLunarJson(lunar)
  const expectTime = dayjs(Lunar.fromYmd(nowYear, Number(month), Number(day)).getSolar().toString())

  // 判断是否是今日
  if (expectTime.isSame(now, 'day')) {
    // // 如果是今日，则返回 0
    return 0
  } else if (expectTime.isAfter(now)) {
    // 如果是未来，则返回未来时间与今日的间隔
    // 这里做了写优化，expectTime.diff(now, 'day') 会舍去小数，未来时间和当前时间小于 24 小时会返回 0
    // 如果 interval 为 0，则返回 expectTime.fromNow()，精确显示剩余时间
    const interval = expectTime.diff(now, 'day', true)
    // return interval < 1 ? expectTime.fromNow(true) : interval
    return interval
  } else {
    // 如果是过去，则返回下一年的时间与今日的间隔
    const nextExpectTime = dayjs(Lunar.fromYmd(nowYear + 1, Number(month), Number(day)).getSolar().toString())
    return nextExpectTime.diff(now, 'day')
  }
}
