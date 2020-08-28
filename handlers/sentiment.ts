import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { getWarnableIntent } from '../util'

export class SentimentHandler extends BaseHandler {
  _name = 'sentiment'

  async onMessage(message: Message) {
    if (message.author.bot) return false

    if (message.channel.id === this.loaded.channels.hornyLobby.id) return false
    
    const type = await getWarnableIntent(message.content)
    if (!type) return false

    await this.loaded.channels.reports.send(`
**This message by ${message.member} in ${message.channel} has been detected as type ${type}:**
${message.content}

These are wildly inaccurate so nothing has been done
Message link: https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}
    `.trim())

    return false
  }
}