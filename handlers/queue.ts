import { BaseHandler, OnMessageExtras } from './_base'
import { Message, GuildMember, TextChannel } from 'discord.js'
import schedule from 'node-schedule'
import { prefix } from '../config'
import { queue, dequeue, hasRole } from '../util'

export class QueueHandler extends BaseHandler {
  _name = 'queue'
  
  async onInit() {
    schedule.scheduleJob('0 8 * * *', () => {
      this.task().catch((error) => {
        console.log('> Error during queue check task!')
        console.log(error)
      })
    })
  }
  
  async onJoin(member: GuildMember) {
    await queue(this.loaded, member)
    return true
  }
  
  async onLeave(member: GuildMember) {
    await dequeue(this.loaded, member)
    return true
  }

  async onMessage(message: Message, { members }: OnMessageExtras) {
    if (!hasRole(message.member, this.loaded.roles.super)) return false

    if (message.content.startsWith(`${prefix}queue`)) {
      console.log('[Queue] Starting queue')
      try {
        if (message.deletable) await message.delete()
      } catch {}
      
      if (members.length < 1) {
        try {
          await message.member.send(`${this.loaded.emojis.no} You must specify a member to manually queue!`)
        } catch {}
        return true
      }
      
      for (const member of members) {
        try {
          if (member.roles.get(this.loaded.roles.verified.id)) {
            await message.member.send(`${this.loaded.emojis.no} ${member} is verified, so you can't manually queue them!`)
          } else if (member.roles.get(this.loaded.roles.wandering.id)) {
            await message.member.send(`${this.loaded.emojis.no} ${member} is already queued, so you can't manually queue them!`)
          } else {
            console.log('[Queue] Running queue function')
            await queue(this.loaded, member)
            await message.member.send(`${this.loaded.emojis.yes} ${member} has been queued.`)
          }
        } catch {}
      }

      return true
    }

    return false
  }

  async task() {
    console.log('> Checking queued users')

    const newGuild = await this.loaded.guild.fetchMembers()
    const freshWanderingRole = newGuild.roles.get(this.loaded.roles.wandering.id)
    if (!freshWanderingRole) return

    await Promise.all(freshWanderingRole.members.map(async (member) => {
      const timeSinceJoin = Date.now() - member.joinedTimestamp
      const daysSinceJoin = Math.floor(timeSinceJoin / 1000 / 60 / 60 / 24)
      const daysLeft = 3 - daysSinceJoin
      if (daysLeft >= 3) return

      const channel = this.loaded.guild.channels.find((channel) => channel.name === `limbo-${member.id}`) as TextChannel | undefined
      if (!channel) return

      let message = ''
      message += member.toString()
      if (daysLeft > 1) {
        message += ` you have **${daysLeft} days** left to send your verification message! See the message at the top to learn how`
      } else if (daysLeft === 1) {
        try {
          await member.send(`Just a friendly reminder, you only have **1 day** left to become verified on PwnSquad or you'll be **kicked**! *Don't worry, all you have to do is tell us a little about yourself :)*`)
          return
        } catch (error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }

        message += ` you have **1 day** left to send your verification message, and you're really close to being **kicked**`
      } else {
        await member.kick()
        try {
          await member.send(`Sorry, but you've kicked from PwnSquad for not sending your verification message fast enough. In our defense, we warned you ahread of time! *If you want to try again feel free to join back*`)
        } catch (error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        return
      }

      await channel.send(message)
    }))
  }
}