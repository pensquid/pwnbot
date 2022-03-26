import { GuildMember, Role } from 'discord.js'
import fetch from 'node-fetch'

export const betterParseInt = (number: string) => {
	if (number.startsWith('0x')) {
		return parseInt(number.slice(2), 16)
	} else if (number.startsWith('0b')) {
		return parseInt(number.slice(2), 2)
	} else if (number.startsWith('0o')) {
		return parseInt(number.slice(2), 8)
	} else {
		return parseInt(number)
	}
}

export const getNonContentWarningText = (content: string): string => {
	if (!content.includes('||')) return content
	if (!content.includes('cw: ')) return content

	let inSpoiler = false
	let outsideSpoiler = ''

	for (let i = 0; i < content.length; i++) {
		const char = content[i]
		const nextChar = content[i + 1] ?? ''

		if (char === '|' && nextChar === '|') {
			i++
			inSpoiler = !inSpoiler
		} else if (!inSpoiler) {
			outsideSpoiler += char
		}
	}

	return outsideSpoiler
}

export const getWarnableIntent = async (
	text: string
): Promise<string | null> => {
	const res = await fetch(
		`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${encodeURIComponent(
			process.env.PERSPECTIVE_KEY as string
		)}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comment: { text },
				languages: ['en'],
				requestedAttributes: {
					IDENTITY_ATTACK: {},
					INSULT: {},
					SEXUALLY_EXPLICIT: {},
					THREAT: {},
					SEVERE_TOXICITY: {},
				},
			}),
		}
	)
	const json = await res.json()

	for (const key of Object.keys(json.attributeScores)) {
		if (json.attributeScores[key].summaryScore.value > 0.8) {
			return key
		}
	}

	return null
}

export const hasRole = (
	member: GuildMember | null,
	roleId: string
): boolean => {
	return !!member?.roles.resolve(roleId)
}
