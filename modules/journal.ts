import { CONSTANTS } from '../constants'
import { Module } from './modules'

export const JournalModule: Module = (client) => {
	client.on('messageCreate', async (msg) => {
		if (msg.author.bot || msg.channel.id !== CONSTANTS.channels.testing) return
		if (msg.channel.type !== 'GUILD_TEXT') return
		const thread = await msg.channel.threads.create({
			startMessage: msg,
			// TODO: add date
			name: `${msg.member?.nickname ?? msg.author.username}`,
			autoArchiveDuration: 1440,
		})
		await thread.join()
		await thread.send('hi there!')
	})
}
