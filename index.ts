require('dotenv').config()

import Discord, { CommandInteraction } from 'discord.js'
import { CountingModule } from './modules/counting'

import { COMMANDS } from './commands'
import { Command } from './commands/types'
import { JoinMsgModule } from './modules/joinmsg'
import { NsfwModule } from './modules/nsfw'

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
	],
})

const MODULES = [JoinMsgModule, CountingModule, NsfwModule]
MODULES.forEach((m) => m(client))

client.on('ready', async () => {
	console.log(`> Logged in as ${client.user!.tag}`)
	client.user!.setActivity('you', { type: 'WATCHING' })
})

async function handleCommandError(interaction: CommandInteraction, e: any) {
	console.error(`Error in command ${interaction.commandName}`, e)
	const msg = 'An unexpected error occurred while running that command'
	if (interaction.deferred || interaction.replied) {
		await interaction.editReply(msg)
	} else {
		await interaction.reply(msg)
	}
}

const commandsMap = new Map<string, Command>()
COMMANDS.forEach((c) => commandsMap.set(c.meta.name, c))
client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		const cmd = commandsMap.get(interaction.commandName)
		if (!cmd) return
		try {
			await cmd.handler(interaction)
		} catch (e) {
			await handleCommandError(interaction, e)
		}
	}
})

async function main() {
	await client.login(process.env.BOT_TOKEN)
}

main()
