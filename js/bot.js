const axios = require('axios')
const dayjs = require('dayjs')

// const testHook = 'https://open.feishu.cn/open-apis/bot/v2/hook/4ef746b8-6351-49d1-bba7-1d2428ea0f2d';
const hook = 'https://open.feishu.cn/open-apis/bot/v2/hook/d9315fd3-1762-42b2-ad7a-f0655fbd8ac7';

const getTemp = (info = {}) => {
  const { content = '', created_at = 0, id = 0 } = info
  const source = content.split('】');
  let titleText, bodyText
  if (source.length > 1) {
    titleText = source[0]
    bodyText = source[1]
  } else {
    bodyText = source[0]
  }
  return (
    {
      "config": {
        "wide_screen_mode": true
      },
      "elements": [
        {
          "fields": [
            {
              "is_short": true,
              "text": {
                "content": `**时间**\n ${dayjs(created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}`,
                "tag": "lark_md"
              }
            },
            {
              "is_short": true,
              "text": {
                "content": "**来源**\n 金色财经",
                "tag": "lark_md"
              }
            }
          ],
          "tag": "div"
        },
        {
          tag: 'div',
          text: {
            "tag":"plain_text",
            "content": bodyText
          }
        },
        {
          actions: [
            {
              "tag": "button",
              "text": {
                "content": "查看新闻",
                "tag": "plain_text"
              },
              "type": "primary",
              "value": {
                "key": "value"
              },
              "url": `https://www.jinse.com/lives/${id}.html`
            }
          ],
          tag: "action"
        },
      ],
      "header": {
        "template": "blue",
        "title": {
          "content": titleText ? titleText + '】' : '币圈快讯',
          "tag": "plain_text"
        }
      },
    }
  )
}

let id = 0;
const query = () => {
  console.log('querying', new Date())
  try {
    axios.get('https://api.jinse.com/live/list').then(res => {
      const { top_id = 0, list = [] } = res?.data || {};
      if(top_id!== id && list.length) {
        id = top_id
        const { lives = [] } = list[0]
        if (lives.length) {
          send(getTemp(lives[0]));
        }
      }
    })
  } catch (e){
    console.log(e)
  }
}
const send = (card) => {
  axios.post(hook, {
    msg_type: 'interactive',
    card
  }).then(res => console.log(res))
}

query()
setInterval(() => {
  query()
}, 60000)