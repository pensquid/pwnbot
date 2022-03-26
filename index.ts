require('dotenv').config()

import Discord, { Message, GuildMember } from 'discord.js'
import { AppDataSource } from './data-source'
import { CountingModule } from './modules/counting'

import { JoinMsgModule } from './modules/joinmsg'
import { NsfwModule } from './modules/nsfw'

const client = new Discord.Client({
	intents: [
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

async function main() {
	await AppDataSource.initialize()
	await client.login(process.env.BOT_TOKEN)
}

main()
