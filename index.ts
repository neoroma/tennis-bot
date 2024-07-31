import TelegramBot, { type SendMessageOptions } from 'node-telegram-bot-api'

const botApiToken = Bun.env.BOT_API_TOKEN

if (!botApiToken) {
	throw new Error('No BOT_API_TOKEN provided')
}


const bot = new TelegramBot(botApiToken, { polling: true })

const options: SendMessageOptions = {
	reply_markup: {
		inline_keyboard: [
			[{ text: 'Button 1', callback_data: 'option1' }],
			[{ text: 'Button 2', callback_data: 'option2' }]
		]
	}
};

bot.setMyCommands([
	{ command: '/start', description: 'START' },
	{ command: '/info', description: 'INFO' },
])

bot.on('message', async (msg) => {
	const { chat: { id }, text } = msg

	if (text === '/start') {
		return await bot.sendMessage(id, 'Choose an option: ', options)
	}

	return await bot.sendMessage(id, 'polo')
});
