// Bark 纪念日推送
import { getCryptoParams, pushMsg } from '../utils/pusher'
import { sleep } from '../utils'
export async function anniversary() {
  const deviceKeys = [process.env.BARK_DEVICE_KEY_1, process.env.BARK_DEVICE_KEY_2] as string[]

  const { ciphertext, iv } = await getCryptoParams()
  for (const deviceKey of deviceKeys) {
    pushMsg(deviceKey, ciphertext, iv)
    sleep()
  }
}
