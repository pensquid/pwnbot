import { Message } from 'discord.js'
import { BaseHandler } from './_base'
import { betterParseInt } from '../util'

export class CountingHandler extends BaseHandler {
  _name = 'counting'

  async onMessage(message: Message) {
    if (message.channel !== this.loaded.channels.counting) return false
    
    const lastMessages = await message.channel.fetchMessages({ limit: 2 })
    const last = lastMessages.last()

    const parsedLast = betterParseInt(last.content)
    const parsedCurrent = betterParseInt(message.content)

    if (parsedCurrent - parsedLast !== 1 || last.author === message.author) {
      await message.delete()
    }

    return true
  }

  async onMessageUpdate(message: Message, newMessage: Message) {
    if (message.channel !== this.loaded.channels.counting) return false
    const last = await (await message.channel.fetchMessages({ limit: 1 })).last()

    // Short circuits if the message updated isn't the latest message
    if(message.id !== last.id) return false
    
    const parsedOld = betterParseInt(message.content)
    const parsedNew = betterParseInt(newMessage.content)

    if(parsedNew !== parsedOld) await message.delete() 

    return true
  }
}