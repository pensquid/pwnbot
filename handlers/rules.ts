import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { prefix } from '../config'

export class RulesHandler extends BaseHandler {
  _name = 'rules'

  async onMessage(message: Message) {
    if (message.content.startsWith(`${prefix}rules`)) {
      await message.channel.send(`Read our server's rules in ${this.loaded.channels.rules}!`)
      return true
    }
    
    return false
  }
}