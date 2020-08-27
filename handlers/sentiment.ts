import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { getToxicity, hasRole } from '../util'

export class SentimentHandler extends BaseHandler {
  _name = 'sentiment'
  
  async onInit() {}
  async onJoin() { return false }
  async onLeave() { return false }

  async onMessage(message: Message) {
    const toxicity = await getToxicity(message.content)
    if (toxicity < 0.35) return false

    await this.loaded.channels.reports.send(`
**This message by ${message.member} in ${message.channel} has been detected as potentially toxic:**
${message.content}
*These toxicity predictions are wildly accurate so no action has been taken. Toxicity score: ${toxicity}*
    `.trim())

    return true
  }
}