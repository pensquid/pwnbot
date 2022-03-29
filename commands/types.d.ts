import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, CommandInteraction } from 'discord.js'

export interface CommandMeta {
	name: string
	toJSON: () => any
}

export type Command = {
	meta: CommandMeta
	handler: (interaction: CommandInteraction) => Promise<void>
}
