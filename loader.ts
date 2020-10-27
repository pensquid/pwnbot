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
    reports: TextChannel,
    venting: TextChannel,
    staffDiscussions: TextChannel
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
    super: loaded.guild?.roles.get('762072849711366164') as Role,
    wandering: loaded.guild?.roles.get('762072882225348688') as Role,
    verified: loaded.guild?.roles.get('762072860113764393') as Role,
    ping: loaded.guild?.roles.get('762072859380023327') as Role
  }

  loaded.channels = {
    lobby: loaded.guild?.channels.get('762072969882894376') as TextChannel,
    roles: loaded.guild?.channels.get('762072966938361896') as TextChannel,
    giveaways: loaded.guild?.channels.get('762072961292697640') as TextChannel,
    br: loaded.guild?.channels.get('762072963063087174') as TextChannel,
    rules: loaded.guild?.channels.get('540370552200757248') as TextChannel,
    jam: loaded.guild?.channels.get('762073012747894784') as TextChannel,
    counting: loaded.guild?.channels.get('762072973775339520') as TextChannel,
    reports: loaded.guild?.channels.get('762114486705586178') as TextChannel,
    venting: loaded.guild?.channels.get('762072971330060288') as TextChannel,
    staffDiscussions: loaded.guild?.channels.get('762072979835977778') as TextChannel
  }

  loaded.categories = {
    verification: loaded.guild?.channels.get('762072945702993921') as CategoryChannel
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
