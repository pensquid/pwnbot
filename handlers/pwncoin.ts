import { BaseHandler } from './_base'
import { Message } from 'discord.js'
import { prefix } from '../config'

const apiUrl = 'https://v2-api.sheety.co/fa7b3330a4fd8309592da41028e8dce4/pwnCoin/balances'

interface Balance {
  id: string,
  amount: number
}

interface ApiResponse {
  balances: Balance[]
}

export class PwncoinHandler extends BaseHandler {
  _name = 'pwncoin'

  async onMessage(message: Message) {
    if (message.content.startsWith(`${prefix}bal`)) {
      const user = message.mentions.users.first() || message.author

      const res = await fetch(apiUrl)
      const { balances } = await res.json() as ApiResponse

      const balance = balances.find(({ id }) => id === user.id)
      const amount = balance ? balance.amount : 0
  
      await message.channel.send(`\`${user.tag}\` has **${amount}** ${this.loaded.emojis.pwncoin}`)
      return true
    }
    
    if (message.content.startsWith(`${prefix}lead`)) {
      const res = await fetch(apiUrl)
      const { balances } = await res.json() as ApiResponse
      balances.sort((a, b) => a.amount > b.amount ? -1 : 1)
  
      const firstTenBalances = await Promise.all(balances
        .slice(0, 10)
        .map(async ({ id, amount }) => ({
          user: await this.client.fetchUser(id),
          amount
        })))
      
      const leaders = firstTenBalances
        .map(({ user, amount }, index) => `${index + 1}. \`${user.tag}\` has **${amount}** PwnCoin`)
        .join('\n')
  
      await message.channel.send(`${this.loaded.emojis.pwncoin} **Leaderboard:**\n${leaders}`)
      return true
    }
    
    if (message.content.startsWith(`${prefix}tot`)) {
      const res = await fetch(apiUrl)
      const { balances } = await res.json() as ApiResponse
      const total = balances.reduce((p, c) => p += c.amount, 0)
  
      await message.channel.send(`There's **${total}** ${this.loaded.emojis.pwncoin} in circulation!`)
      return true
    }

    return false
  }
}