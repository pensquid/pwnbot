import { GuildMember, Message, User, Collection, Client, MessageReaction } from 'discord.js'
import { BaseLoaded } from '../loader'

const welcomeEmojis = ['😝', '🍻', '😄', '🎉', '👍', '🤠', '👋', '🤖', '👊', '❤️']

export interface OnMessageExtras {
  users: Collection<string, User>,
  members: GuildMember[]
}

export abstract class BaseHandler {
  client: Client
  loaded: BaseLoaded

  abstract _name: string
  
  constructor(client: Client, loaded: BaseLoaded) {
    this.client = client
    this.loaded = loaded
  }
  
  async onInit(): Promise<void> {}
  async onJoin(member: GuildMember): Promise<boolean> {
    const baseWelcome = `
${member} welcome to PwnSquad: the only programming server with at least two distinct conversations at any given time!
Make sure to read the ${this.loaded.channels.rules} and get some cool ${this.loaded.channels.roles}.
We're still recovering from a raid so many of our resources and giveaways are missing - please be patient.
**If you want to get important updates and participate in giveaways, <ping>!** (We don't ping often)
    `.trim()

    await this.loaded.channels.lobby.send(welcomeEmojis[Math.floor(Math.random() * welcomeEmojis.length)])
    const m = await this.loaded.channels.lobby.send(baseWelcome.replace('<ping>', `react to this message with ${this.loaded.emojis.ping}`))

    const reaction = await m.react(this.loaded.emojis.ping)
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
    })

    return true
  }
  async onLeave(member: GuildMember): Promise<boolean> { return false }
  async onMessage(message: Message, extras: OnMessageExtras): Promise<boolean> { return false }
  async onMessageUpdate(oldMessage: Message, newMessage: Message): Promise<boolean> { return false}
}