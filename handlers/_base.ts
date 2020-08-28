import { GuildMember, Message, User, Collection, Client } from 'discord.js'
import { BaseLoaded } from '../loader'

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
  async onJoin(member: GuildMember): Promise<boolean> { return false }
  async onLeave(member: GuildMember): Promise<boolean> { return false }
  async onMessage(message: Message, extras: OnMessageExtras): Promise<boolean> { return false }
}