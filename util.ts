import { Loaded, BaseLoaded } from './loader'
import { GuildMember, TextChannel, Role } from 'discord.js'
import fetch from 'node-fetch'

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

export const getNonContentWarningText = (content: string): string => {
  if (!content.includes('||')) return content
  if (!content.includes('cw: ')) return content

  let inSpoiler = false
  let outsideSpoiler = ''

  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    const nextChar = content[i + 1] ?? ''

    if (char === '|' && nextChar === '|') {
      i++
      inSpoiler = !inSpoiler
    } else if (!inSpoiler) {
      outsideSpoiler += char
    }
  }

  return outsideSpoiler
}

export const getWarnableIntent = async (text: string): Promise<string | null> => {
  const res = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${encodeURIComponent(process.env.PERSPECTIVE_KEY as string)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: { text },
      languages: [ 'en' ],
      requestedAttributes: {
        IDENTITY_ATTACK: {},
        INSULT: {},
        SEXUALLY_EXPLICIT: {},
        FLIRTATION: {}
      }
    })
  })
  const json = await res.json()

  for (const key of Object.keys(json.attributeScores)) {
    if (json.attributeScores[key].summaryScore.value > 0.8) {
      return key
    }
  }

  return null
}

export const hasRole = (member: GuildMember, role: Role): boolean => {
  return !!member.roles.find((r) => r.id === role.id)
}