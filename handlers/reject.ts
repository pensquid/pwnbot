import { BaseHandler, OnMessageExtras } from './_base'
import { Message } from 'discord.js'
import { prefix } from '../config'
import { hasRole } from '../util'

export class RejectHandler extends BaseHandler {
  _name = 'reject'
  
  async onInit() {}
  async onJoin() { return false }
  async onLeave() { return false }

  async onMessage(message: Message, { members }: OnMessageExtras) {
    if (!hasRole(message.member, this.loaded.roles.super)) return false

    if (message.content.startsWith(`${prefix}reject`)) {
      if (members.length < 1) {
        await message.channel.send(`${this.loaded.emojis.no} You must specify a member to reject!`)
        return true
      }
  
      for (const member of members) {
        if (member.roles.get(this.loaded.roles.verified.id)) {
          await message.channel.send(`${this.loaded.emojis.no} ${member} is verified, so you can't reject them! You may want to kick them instead.`)
        } else {
          try {
            await member.send('Sorry, but your application has been rejected. Feel like trying again? Just join back!')
          } catch (error) {
            await message.member.send(`⚠️ Unable to DM ${member}. They probably just have DMs disabled.`)
          }
          await member.kick()

          try {
            if (message.deletable) await message.delete()
          } catch {}
        }
      }

      return true
    }

    return false
  }
}