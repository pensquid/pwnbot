import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { User } from '../entities/User'
import { Command } from './types'

// copied from https://github.com/marnusw/date-fns-tz/blob/8baea431b78d17fcf8a10ff4c7e168b3008b9d39/src/_lib/tzIntlTimeZoneName/index.js#L1
function tzName(timeZone: string): string | undefined {
	// first arg is locale
	return new Intl.DateTimeFormat(undefined, { timeZone, timeZoneName: 'long' })
		.formatToParts()
		.filter((i) => i.type === 'timeZoneName')[0]?.value
}

async function handler(interaction: CommandInteraction) {
	await interaction.deferReply()
	const timezone = interaction.options.getString('timezone')!
	let name
	try {
		name = tzName(timezone)
	} catch (e) {
		if (
			e instanceof RangeError &&
			e.toString().startsWith('RangeError: Invalid time zone specified')
		) {
			return void (await interaction.editReply('Invalid time zone specified'))
		}
		throw e
	}
	await User.upsert(
		{ discordID: interaction.user.id, timezone, isRegistered: true },
		['discordID']
	)
	await interaction.editReply(`Timezone successfully set to \`${name}\``)
}

export const TimezoneCommand: Command = {
	meta: new SlashCommandBuilder()
		.setName('timezone')
		.setDescription('Updates your timezone')
		.addStringOption((option) =>
			option
				.setName('timezone')
				.setDescription('IANA timezone name, e.g. `America/Los_Angeles`')
				.setRequired(true)
		),
	handler,
}
