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

	function getDateStamp(timezone: string, date: Date): string {
		return formatInTimeZone(date, timezone, 'yyyy-MM-dd')
	}

	function threadName(msg: Message, timezone: string) {
		return `${msg.member?.nickname ?? msg.author.username} - ${formatInTimeZone(
			now(),
			timezone,
			'MM-dd'
		)}`
	}

	async function getReply(msg: Message): Promise<[string, string]> {
		const user = await User.findOne({ where: { discordID: msg.author.id } })
		// TODO reword this
		if (!user)
			return [threadName(msg, 'UTC'), 'Run `/timezone` to set up streaks']
		const dateStamp = getDateStamp(user.timezone, now())
		const entry = await Entry.upsert(
			{
				dateStamp,
				messageID: msg.id,
				content: msg.content,
				author: user,
			},
			['dateStamp', 'author']
		)
		const entries = await Entry.find({ where: { author: { id: user.id } } })
		return [
			threadName(msg, user.timezone),
			entries
				.map((i) => `ID: ${i.id}, content: ${JSON.stringify(i.content)}`)
				.join('\n'),
		]
	}

	client.on('messageCreate', async (msg) => {
		if (msg.author.bot || msg.channel.id !== CONSTANTS.channels.testing) return
		if (msg.channel.type !== 'GUILD_TEXT') return
		const [threadName, reply] = await getReply(msg)
		const thread = await msg.channel.threads.create({
			startMessage: msg,
			// TODO: add date
			name: threadName,
			autoArchiveDuration: 1440,
		})
		await thread.join()
		await thread.send(reply)
	})
}
