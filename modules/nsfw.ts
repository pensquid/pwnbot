import { Message, TextChannel } from 'discord.js'
import { getNonContentWarningText, hasRole } from '../util'
import { CONSTANTS } from '../constants'
import { Module } from './modules'

const regexes = [
	/(^| |"|'|`)p.?e.?n.?i.?s($| |"|'|`)/i,
	/(^| |"|'|`)cum($| )/i,
	/(^| |"|'|`)v.?a.?g.?i.?n.?a($| |"|'|`)/i,
	/(^| |"|'|`)clit($| |oris|"|'|`)/i,
	/(^| |"|'|`)mast[uv]rbate($| |"|'|`)/i,
	/(^| |"|'|`)d[i1]ck($| |"|'|`)/,
	/(^| |"|'|`)jerk\s*off($| |"|'|`)/,
	/(^| |"|'|`)s[e3]x($| |"|'|`)/,
	/(^| |"|'|`)horny($| |"|'|`)/,
	/(^| |"|'|`)nigg(a|er)($| |"|'|`)/,
	/(^| |"|'|`)suicide($| |"|'|`)/,
	/(^| |"|'|`)trannie($| |"|'|`)/,
	/(^| |`)kill\s+(your|my)self($| |`)/,
	/(^| |`)kys($| |`)/,
	/(^| |`)cuntboy($| |`)/,
	/(^| |`)shemale($| |`)/,
	/(^| |`)troon($| |`)/,
	/(^| |`)khanith($| |`)/,
]

export const NsfwModule: Module = (client) => {
	client.on('messageCreate', async (message): Promise<void> => {
		if (message.author.bot) return

		if (
			[
				CONSTANTS.channels.staffDiscussions,
				CONSTANTS.channels.venting,
			].includes(message.channel.id)
		)
			return

		if (hasRole(message.member, CONSTANTS.roles.super)) {
			return
		}

		const text = getNonContentWarningText(message.content)
		for (const regex of regexes) {
			if (text.toLowerCase().match(regex)) {
				const reports = (await client.channels.fetch(
					CONSTANTS.channels.reports
				)) as TextChannel
				await reports.send(
					`
**Potentially NSFW/disturbing message by ${message.member} in ${message.channel} has been deleted:**
${message.content}
        `.trim()
				)
				await message.delete()
				return
			}
		}
	})
}
