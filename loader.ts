import { Guild, Role, TextChannel, CategoryChannel, Emoji, GuildMember, Client } from 'discord.js'

export interface BaseLoaded {
  guild: Guild,
  roles: {
    super: Role,
    wandering: Role,
    verified: Role,
    ping: Role
  },
  channels: {
    lobby: TextChannel,
    roles: TextChannel,
    giveaways: TextChannel,
    br: TextChannel,
    rules: TextChannel,
    jam: TextChannel,
    counting: TextChannel,
    nsfwReports: TextChannel,
    venting: TextChannel,
    staffDiscussions: TextChannel,
    hornyLobby: TextChannel
  },
  categories: {
    verification: CategoryChannel
  },
  emojis: {
    no: Emoji,
    yes: Emoji,
    pwncoin: Emoji,
    ping: Emoji
  },
  members: {
    ctfbot: GuildMember
  }
}

export type Loaded = ({ done: true } & BaseLoaded) | ({ done: false } & Partial<BaseLoaded>)

export const loaded: Loaded = {
  done: false
}

export const load = async (client: Client) => {
  loaded.guild = client.guilds.get('520444262685474816')

  loaded.roles = {
    super: loaded.guild?.roles.get('630212418072739861') as Role,
    wandering: loaded.guild?.roles.get('563143582765023232') as Role,
    verified: loaded.guild?.roles.get('520461398183247875') as Role,
    ping: loaded.guild?.roles.get('559814932460208167') as Role
  }

  loaded.channels = {
    lobby: loaded.guild?.channels.get('520452924967747584') as TextChannel,
    roles: loaded.guild?.channels.get('520466535198752778') as TextChannel,
    giveaways: loaded.guild?.channels.get('577225038621704241') as TextChannel,
    br: loaded.guild?.channels.get('520452891471773697') as TextChannel,
    rules: loaded.guild?.channels.get('540370552200757248') as TextChannel,
    jam: loaded.guild?.channels.get('621350573861502986') as TextChannel,
    counting: loaded.guild?.channels.get('591333906431606789') as TextChannel,
    nsfwReports: loaded.guild?.channels.get('748398172858089473') as TextChannel,
    hornyLobby: loaded.guild?.channels.get('746914585797197906') as TextChannel,
    venting: loaded.guild?.channels.get('563889418587602964') as TextChannel,
    staffDiscussions: loaded.guild?.channels.get('520453425444683776') as TextChannel
  }

  loaded.categories = {
    verification: loaded.guild?.channels.get('673054726119751680') as CategoryChannel
  }

  loaded.emojis = {
    no: loaded.guild?.emojis.get('630451133575331898') as Emoji,
    yes: loaded.guild?.emojis.get('630451215037235213') as Emoji,
    pwncoin: loaded.guild?.emojis.get('646199089951670293') as Emoji,
    ping: loaded.guild?.emojis.get('639244066894118961') as Emoji
  }

  loaded.members = {
    ctfbot: loaded.guild?.members.get('580257069760905216') as GuildMember
  }

  // @ts-ignore-line
  loaded.done = true
}