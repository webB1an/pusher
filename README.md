# Pusher

1. 发到服务器上使用记得`.dev.env`和`.prod.env`设置环境变量

```bash
# Bark 设备 key
BARK_DEVICE_KEY_1=
BARK_DEVICE_KEY_2=

# Bark 加密 key
BARK_PUSH_KEY=
BARK_PUSH_IV=
BARK_PUSH_URL=

# 日期
MEET_DATE=
CARD_DATE=
MARRY_DATE=
CHILD_DATE=

# 企业微信群机器人推送 key
WECHAT_PUSH_KEY=

# 和风天气 key
WEATHER_KEY=
BAIDU_APP_ID=
BAIDU_APP_KEY=
```


2. 
pm2 start npm --name "pusher" -- start
pm2 logs pusher
# 设置应用开机自启动
pm2 startup
pm2 save

# 停止所有应用
停止当前运行的 pm2 实例： 首先，你可以选择停止所有通过 pm2 启动的应用：
pm2 stop all
删除 pm2 的启动配置： 使用以下命令来删除 pm2 的开机自启配置，这个命令会取消之前通过 pm2 startup 设置的自启
pm2 unstartup
验证设置： 你可以通过以下命令检查 pm2 的状态，确保没有设置开机自启
pm2 status

- [手动执行](http://localhost:3000/pusher/do)
- [Bark 文档](https://bark.day.app/#/tutorial)

- [企业微信群机器人](https://developer.work.weixin.qq.com/document/path/91770#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E7%BE%A4%E6%9C%BA%E5%99%A8%E4%BA%BA)

项目中集成了百度和和风天气的 API，需要申请对应的 key 才能使用。
- [和风天气 API](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
- [高德地图控制台](https://console.amap.com/dev/key/app)
