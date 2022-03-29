import { REST } from '@discordjs/rest'
import arg from 'arg'
import { Routes } from 'discord-api-types/v9'
import { COMMANDS } from '../commands'

const commandNames: string[] = COMMANDS.map((c) => c.meta.name)
const commandData: any[] = COMMANDS.map((c) => c.meta.toJSON())

async function main() {
	if (!process.env.BOT_TOKEN) throw new Error('missing BOT_TOKEN env variable')
	const args = arg({
		'--client-id': String,
		'--guild-id': String,
	})
	if (!args['--client-id']) throw new Error('Client ID is required')
	const clientId: string = args['--client-id']
	const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

	const [name, route] = args['--guild-id']
		? ['guild', Routes.applicationGuildCommands(clientId, args['--guild-id'])]
		: ['global', Routes.applicationCommands(clientId)]

	console.log(`Updating ${name} slash commands...`)
	console.log(`${commandNames.length} commands:\n${commandNames.join('\n')}`)
	await rest.put(route, { body: commandData })
}

main()
