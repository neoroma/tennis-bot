import TelegramBot, { type SendMessageOptions } from 'node-telegram-bot-api'

const botApiToken = Bun.env.BOT_API_TOKEN

if (!botApiToken) {
  throw new Error('No BOT_API_TOKEN provided')
}

const bot = new TelegramBot(botApiToken, { polling: true })

const options: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Player One', callback_data: 'p_1' },
        { text: 'Player Two', callback_data: 'p_2' },
      ],
    ],
  },
}

bot.setMyCommands([
  { command: '/start', description: 'START' },
  { command: '/info', description: 'INFO' },
])

type GameScore = 0 | 15 | 30 | 40 | 45
let score: [GameScore, GameScore] = [0, 0]

const incTennisGameScore = (current: GameScore) => {
  switch (current) {
    case 0:
      return 15
    case 15:
      return 30
    case 30:
      return 40
    default:
      return 0
  }
}

bot.on('message', async (msg) => {
  const {
    chat: { id },
    text,
    from,
  } = msg

  if (text === '/start') {
    return await bot.sendMessage(id, 'Point won: ', options)
  }

  return await bot.sendMessage(id, `what did you say, ${from?.username}`)
})

bot.on('callback_query', async ({ data, message }) => {
  const [p1Score, p2Score] = score
  let winner = ''

  if (data === 'p_1') {
    if (p1Score === 40 && p2Score === 40) {
      score = [45, p2Score]
    } else if (p1Score === 45 || (p1Score === 40 && p1Score > p2Score)) {
      winner = 'Player 1'
      score = [0, 0]
    } else {
      score = [incTennisGameScore(p1Score), p2Score]
    }
  } else if (data === 'p_2') {
    if (p1Score === 40 && p2Score === 40) {
      score = [p1Score, 45]
    } else if (p2Score === 45 || (p2Score === 40 && p2Score > p1Score)) {
      winner = 'Player 2'
      score = [0, 0]
    } else {
      score = [p1Score, incTennisGameScore(p2Score)]
    }
  }

  if (winner) {
    return await bot.sendMessage(message?.chat.id!, `Winner: ${winner}`, options)
  } else {
    return await bot.sendMessage(
      message?.chat.id!,
      `current score: ${score.join(':').replace('45', 'Advantage')}`,
      options
    )
  }
})
