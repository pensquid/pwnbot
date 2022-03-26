import {
	GuildMember,
	Message,
	User,
	Collection,
	Client,
	MessageReaction,
	PartialGuildMember,
	TextChannel,
} from 'discord.js'
import { prefix } from '../config'
import { CONSTANTS } from '../constants'

const welcomeEmojis = [
	'😝',
	'🍻',
	'😄',
	'🎉',
	'👍',
	'🤠',
	'👋',
	'🤖',
	'👊',
	'❤️',
]

export interface OnMessageExtras {
	users: Collection<string, User>
}

export abstract class BaseHandler {
	client: Client

	abstract _name: string

	constructor(client: Client) {
		this.client = client
	}

	async onInit(): Promise<void> {}
	async onJoin(member: GuildMember): Promise<boolean> {
		const baseWelcome = `
${member} welcome to ${CONSTANTS.guild.name}: the only programming server with at least two distinct conversations at any given time!
Make sure to read the <#${CONSTANTS.channels.rules}> and get some cool <#${CONSTANTS.channels.roles}>.
**If you want to get important updates and participate in giveaways, run \`${prefix}}ping\`!** (We don't ping often)
    `.trim()

		const lobby = (await this.client.channels.fetch(
			CONSTANTS.channels.lobby
		)) as TextChannel
		const m = await lobby.send(baseWelcome)

		/*const reaction = await m.react(this.loaded.emojis.ping)
    const timeout = setTimeout(() => {
      try {
        m.edit(baseWelcome.replace('<ping>', 'run `;;role ping`'))
        reaction.removeAll()
      } catch {}
    }, 45000)

    m.awaitReactions((reaction: MessageReaction, user: User) => {
      if (reaction.emoji.id !== this.loaded.emojis.ping.id) return false
      if (user.id !== member.id) return false
      return true
    }, { max: 1, time: 45000 }).then(() => {
      clearTimeout(timeout)
      try {
        member.addRole(this.loaded.roles.ping)
      } catch {}
      m.edit(baseWelcome.replace('<ping>', `you're all set`))
      reaction.removeAll()
    })*/

		return true
	}
	async onLeave(member: GuildMember | PartialGuildMember): Promise<boolean> {
		return false
	}
	async onMessage(message: Message, extras: OnMessageExtras): Promise<boolean> {
		return false
	}
}
