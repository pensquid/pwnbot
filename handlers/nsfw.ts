import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { getNonContentWarningText } from '../util'

const regexes = [
  /(^| |"|'|`)p.?e.?n.?i.?s($| |"|'|`)/i,
  /(^| |"|'|`)cum($| )/i,
  /(^| |"|'|`)v.?a.?g.?i.?n.?a($| |"|'|`)/i,
  /(^| |"|'|`)clit($| |oris|"|'|`)/i,
  /(^| |"|'|`)mast[uv]rbate($| |"|'|`)/i,
  /(^| |"|'|`)d[i1]ck($| |"|'|`)/,
  /(^| |"|'|`)jerk\s*off($| |"|'|`)/,
  /(^| |"|'|`)s[e3]x($| |"|'|`)/,
  /(^| |"|'|`)horny($| |"|'|`)/,
  /(^| |"|'|`)nigg(a|er)($| |"|'|`)/,
  /(^| |"|'|`)suicide($| |"|'|`)/,
  /(^| |"|'|`)trannie($| |"|'|`)/,
  /(^| |`)kill\s+(your|my)self($| |`)/,
  /(^| |`)kys($| |`)/
]

export class NsfwHandler extends BaseHandler {
  _name = 'nsfw'

  async onMessage(message: Message) {
    if (message.author.bot) return false
    
    if ([
      this.loaded.channels.staffDiscussions.id,
      this.loaded.channels.venting.id,
      this.loaded.channels.hornyLobby.id
    ].includes(message.channel.id)) return false

    if (message.member.roles.has(this.loaded.roles.super.id)) {
      return false
    }

    const text = getNonContentWarningText(message.content)
    for (const regex of regexes) {
      if (text.match(regex)) {
        await this.loaded.channels.reports.send(`
**Potentially NSFW/disturbing message by ${message.member} in ${message.channel} has been deleted:**
${message.content}
        `.trim())
        await message.delete()
        return true
      }
    }

    return false
  }
}