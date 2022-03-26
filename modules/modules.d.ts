import { Client } from 'discord.js'

export type Module = (client: Client) => void
