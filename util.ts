import { Loaded, BaseLoaded } from './loader'
import { GuildMember, TextChannel } from 'discord.js'

export const betterParseInt = (number: string) => {
  if (number.startsWith('0x')) {
    return parseInt(number.slice(2), 16)
  } else if (number.startsWith('0b')) {
    return parseInt(number.slice(2), 2)
  } else if (number.startsWith('0o')) {
    return parseInt(number.slice(2), 8)
  } else {
    return parseInt(number)
  }
}

export const queue = async (loaded: BaseLoaded | Loaded, member: GuildMember) => {
  if ('done' in loaded && !loaded.done) return
  await member.addRole(loaded.roles.wandering)

  const channel = await loaded.guild.createChannel(`limbo-${member.id}`, {
    type: 'text',
    parent: loaded.categories.verification,
    topic: `This channel was automatically created for ${member.displayName} so they can get verified!`
  }) as TextChannel
  await channel.lockPermissions()
  await channel.overwritePermissions(member, {
    SEND_MESSAGES: true,
    VIEW_CHANNEL: true
  })

  await channel.send(`
${member} **Welcome to PwnSquad!** We're glad you're finally here. Before we can give you access to the rest of the server, we need to make sure you aren't one of the bad ones.

Please tell us:
- Any programming or hacking knowledge you might have. It's fine if you're new to this!
- What you're looking to get out of this server and/or why you joined.
- And any other information you might want to include. Just tell us about yourself.

To help eliminate spam, you'll be automatically kicked in 7 days if you don't answer these questions.

We hope to see you soon! For more information, here's our website: <https://pwnsquad.net/>
  `.trim())
}

export const dequeue = async (loaded: BaseLoaded | Loaded, member: GuildMember) => {
  if ('done' in loaded && !loaded.done) return
  const channel = loaded.guild.channels.find((channel) => channel.name === `limbo-${member.id}`)
  if (channel) await channel.delete()
}