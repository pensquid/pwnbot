import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { betterParseInt } from '../util'

export class CountingHandler extends BaseHandler {
	_name = 'counting'

	async onMessage(message: Message) {
		if (message.channel !== this.loaded.channels.counting) return false

		const lastMessages = await message.channel.messages.fetch({ limit: 2 })
		const last = lastMessages.last()
		if (!last) return false

		const parsedLast = betterParseInt(last.content)
		const parsedCurrent = betterParseInt(message.content)

		if (parsedCurrent - parsedLast !== 1 || last.author === message.author) {
			await message.delete()
		}

		return true
	}
}
