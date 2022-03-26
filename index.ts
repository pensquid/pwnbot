require('dotenv').config()

import Discord, { Message, GuildMember } from 'discord.js'
import { load, loaded } from './loader'

import { CountingHandler } from './handlers/counting'
import { BaseHandler } from './handlers/_base'
import { NsfwHandler } from './handlers/nsfw'

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
	],
})

const handlers = [NsfwHandler, CountingHandler]

const allHandlers = async (
	f: (h: BaseHandler) => Promise<boolean>,
	fName: string
) => {
	if (!loaded.done) return

	for (const Handler of handlers) {
		const handler = new Handler(client, loaded)
		try {
			const res = await f(handler)
			if (res) break
		} catch (error) {
			console.log(`> ${handler._name} errored in ${fName}!`)
			console.log(error)
		}
	}
}

client.on('ready', async () => {
	console.log(`> Logged in as ${client.user!.tag}`)
	client.user!.setActivity('you', { type: 'WATCHING' })

	load(client)
	if (!loaded.done) return
})

client.on('guildMemberAdd', async (member) => {
	await allHandlers(async (handler) => await handler.onJoin(member), 'onJoin')
})

client.on('guildMemberRemove', async (member) => {
	await allHandlers(async (handler) => await handler.onLeave(member), 'onLeave')
})

client.on('message', async (message: Message) => {
	if (!loaded.done) return

	const users = message.mentions.users
	const members = (await Promise.all(
		users.map((user) => loaded.guild?.members.fetch(user))
	)) as GuildMember[]

	await allHandlers(
		async (handler) => await handler.onMessage(message, { members, users }),
		'onMessage'
	)
})

client.login(process.env.BOT_TOKEN)
