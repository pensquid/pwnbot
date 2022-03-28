import { addDays } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { CONSTANTS } from '../constants'
import { Entry } from '../entities/Entry'
import { User } from '../entities/User'
import { Module } from './modules'
import { Message } from 'discord.js'

export const JournalModule: Module = (client) => {
	let dbgOffset = 0

	function now(): Date {
		return addDays(new Date(Date.now()), dbgOffset)
	}

	function getDateStamp(user: User, date: Date): string {
		return formatInTimeZone(date, user.timezone, 'YYYY-MM-DD')
	}

	async function getReply(msg: Message): Promise<string> {
		const user = await User.findOne({ where: { discordID: msg.author.id } })
		// TODO reword this
		if (!user) return 'Run `/timezone` to set up streaks'
		const dateStamp = getDateStamp(user, now())
		const entry = await Entry.upsert(
			{
				dateStamp,
				content: msg.content,
				author: user,
			},
			[]
		)
		console.log({ entry })
		return `Entry ID: ${entry}`
	}

	client.on('messageCreate', async (msg) => {
		if (msg.author.bot || msg.channel.id !== CONSTANTS.channels.testing) return
		if (msg.channel.type !== 'GUILD_TEXT') return
		const reply = await getReply(msg)
		const thread = await msg.channel.threads.create({
			startMessage: msg,
			// TODO: add date
			name: `${msg.member?.nickname ?? msg.author.username}`,
			autoArchiveDuration: 1440,
		})
		await thread.join()
		await thread.send(reply)
	})
}
