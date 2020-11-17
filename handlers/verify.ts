import { BaseHandler, OnMessageExtras } from './_base'
import { GuildMember, Message, User, MessageReaction } from 'discord.js'
import { prefix } from '../config'
import { hasRole } from '../util'

const welcomeEmojis = ['😝', '🍻', '😄', '🎉', '👍', '🤠', '👋', '🤖', '👊', '❤️']

export class VerifyHandler extends BaseHandler {
  _name = 'verify'

  async onMessage(message: Message, { members }: OnMessageExtras) {
    if (!hasRole(message.member, this.loaded.roles.super)) return false

    if (message.content === '[[ test welcome ]]') {
      await this.welcome(message.member)
      return true
    }

    if (message.content.startsWith(`${prefix}verify`)) {
      if (members.length < 1) {
        await message.channel.send(`${this.loaded.emojis.no} You must specify a member to verify!`)
        return true
      }

      for (const member of members) {
        if (member.roles.get(this.loaded.roles.verified.id)) {
          await message.channel.send(`${this.loaded.emojis.no} ${member} is already verified!`)
        } else {
          const channel = this.loaded.guild.channels.find((channel) => channel.name === `limbo-${member.id}`)
          if (channel) {
            await channel.delete()
          } else {
            await message.member.send(`⚠️ Unable to find limbo channel for ${member}.`)
          }

          await member.removeRole(this.loaded.roles.wandering)
          await member.addRole(this.loaded.roles.verified)
          await this.welcome(member)

          try {
            if (message.deletable) await message.delete()
          } catch {}
        }
      }

      return true
    }

    return false
  }

  private async welcome(member: GuildMember) {
    /*
    ${member} welcome to PwnSquad: the only programming server with at least two distinct conversations at any given time!

Make sure to read the ${this.loaded.channels.rules} and get some cool ${this.loaded.channels.roles}.

If you're interested:
- We usually have giveaways going on in ${this.loaded.channels.giveaways}
- ${this.loaded.channels.br} contains helpful resources if you're just starting out
- **If you want to get important updates and participate in giveaways, <ping>!** (We don't ping often)
*/
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
  }
}