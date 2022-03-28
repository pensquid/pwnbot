import { Message } from 'discord.js'
import { CONSTANTS } from '../constants'
import { betterParseInt } from '../util'
import { Module } from './modules'

export const CountingModule: Module = (client) => {
	client.on('messageCreate', async (message): Promise<void> => {
		if (message.channel.id !== CONSTANTS.channels.counting) return

		const lastMessages = await message.channel.messages.fetch({ limit: 2 })
		const last = lastMessages.last()
		if (!last) return

		const parsedLast = betterParseInt(last.content)
		const parsedCurrent = betterParseInt(message.content)

		if (parsedCurrent - parsedLast !== 1 || last.author === message.author) {
			await message.delete()
		}
	})
}
