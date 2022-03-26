import { TextChannel } from 'discord.js'
import { prefix } from '../config'
import { CONSTANTS } from '../constants'
import { Module } from './modules'

export const JoinMsgModule: Module = (client) => {
	client.on('guildMemberAdd', async (member) => {
		const welcome = `
${member} welcome to ${CONSTANTS.guild.name}: the only programming server with at least two distinct conversations at any given time!
Make sure to read the <#${CONSTANTS.channels.rules}> and get some cool <#${CONSTANTS.channels.roles}>.
**If you want to get important updates and participate in giveaways, run \`${prefix}}ping\`!** (We don't ping often)
    `.trim()

		const lobby = (await client.channels.fetch(
			CONSTANTS.channels.lobby
		)) as TextChannel
		const m = await lobby.send(welcome)
	})
}
