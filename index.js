require('dotenv').config()

const Discord = require('discord.js')
const cron = require('node-cron')
const client = new Discord.Client()
const prefix = ';;'

const loaded = {
  guild: null,
  roles: {
    super: null,
    wandering: null,
    verified: null
  },
  channels: {
    info: null,
    countdown: null
  },
  emojis: {
    no: null,
    yes: null
  }
}

client.on('ready', async () => {
  console.log(`> Logged in as ${client.user.tag}`)
  client.user.setActivity('unverified members', { type: 'WATCHING' })

  loaded.guild = client.guilds.get('520444262685474816')

  loaded.roles.super = loaded.guild.roles.get('520452795250507795')
  loaded.roles.wandering = loaded.guild.roles.get('563143582765023232')
  loaded.roles.verified = loaded.guild.roles.get('520461398183247875')

  loaded.channels.info = loaded.guild.channels.get('559771387766505472')
  loaded.channels.countdown = loaded.guild.channels.get('572967189053702163')

  loaded.emojis.no = loaded.guild.emojis.get('540601942385229834')
  loaded.emojis.yes = loaded.guild.emojis.get('540601942217457674')

  const task = async () => {
    console.log('> Checking users')

    const newGuild = await loaded.guild.fetchMembers()
    const freshWanderingRole = newGuild.roles.get(loaded.roles.wandering.id)

    freshWanderingRole.members.forEach(async (member) => {
      const timeSinceJoin = Date.now() - member.joinedTimestamp
      const daysSinceJoin = Math.floor(timeSinceJoin / 1000 / 60 / 60 / 24)
      const daysLeft = 7 - daysSinceJoin
      if (daysLeft >= 7) return

      let message = ''
      message += member.toString()
      if (daysLeft > 1) {
        message += ` you have **${daysLeft} days** left to send your verification message! See ${loaded.channels.info} to learn how`
      } else if (daysLeft === 1) {
        try {
          await member.send(`Just a friendly reminder, you only have **1 day** left to become verified on PwnSquad or you'll be **kicked**! *Don't worry, all you have to do is tell us a little about yourself :)*`)
        } catch(error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        message += ` you have **1 day** left to send your verification message, and you're really close to being **kicked**. See ${loaded.channels.info} to learn more`
      } else {
        await member.kick()
        try {
          await member.send(`Sorry, but you've kicked from PwnSquad for not sending your verification message fast enough. In our defense, we warned you ahread of time! *If you want to try again feel free to join back*`)
        } catch(error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        return
      }
      await loaded.channels.countdown.send(message)
    })
  }

  cron.schedule('0 8 * * *', task)
})

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix)) return
  if (!message.member.roles.get(loaded.roles.super.id)) return

  const members = message.mentions.members
  if (members.length < 1) {
    await message.channel.send(`${loaded.emojis.no} You must specify a member!`)
    return
  }

  if (message.content.startsWith(`${prefix}verify`)) {
    for (let [ _, member ] of members) {
      if (member.roles.get(loaded.roles.verified.id)) {
        await message.channel.send(`${loaded.emojis.no} ${member} is already verified!`)
      } else {
        await member.removeRole(loaded.roles.wandering)
        await member.addRole(loaded.roles.verified)
        await message.channel.send(`${loaded.emojis.yes} ${member} has been verified.`)
      }
    }
  } else if (message.content.startsWith(`${prefix}reject`)) {
    for (let [ _, member ] of members) {
      if (member.roles.get(loaded.roles.verified.id)) {
        await message.channel.send(`${loaded.emojis.no} ${member} is verified, so you can't reject them! You may want to kick them instead.`)
      } else {
        await member.kick()
        await message.channel.send(`${loaded.emojis.yes} ${member} has been rejected.`)
      }
    }
  }
})

client.login(process.env.BOT_TOKEN)