import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { prefix } from '../config'

export class DataHandler extends BaseHandler {
	_name = 'data'

	async onMessage(message: Message) {
		const dumbContent = message.content
			.replace(/[^a-zA-Z\d:]+/g, '')
			.toLowerCase()
		if (
			dumbContent === 'dontasktoask' ||
			dumbContent === 'donotasktoask' ||
			dumbContent === 'noaskingtoask' ||
			message.content.startsWith(`${prefix}data`)
		) {
			await message.channel.send('https://pwnsquad.net/data')
		}

		return false
	}
}
