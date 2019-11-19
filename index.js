require('dotenv').config()

const Discord = require('discord.js')
const cron = require('node-cron')
const fetch = require('node-fetch')

const client = new Discord.Client()

const prefix = ';;'
const apiUrl = 'https://v2-api.sheety.co/fa7b3330a4fd8309592da41028e8dce4/pwnCoin/balances'

const loaded = {
  guild: null,
  roles: {
    super: null,
    wandering: null,
    verified: null
  },
  channels: {
    info: null,
    countdown: null,
    lobby: null,
    roles: null,
    giveaways: null,
    br: null,
    rules: null,
    jam: null
  },
  emojis: {
    no: null,
    yes: null,
    pwncoin: null
  },
  members: {
    ctfbot: null
  }
}
const welcomeEmojis = ['😝', '🍻', '😄', '🎉', '👍', '🤠', '👋', '🤖', '👊']

const welcome = async (member) => {
  await loaded.channels.lobby.send(welcomeEmojis[Math.floor(Math.random() * welcomeEmojis.length)])
  await loaded.channels.lobby.send(`
${member} welcome to PwnSquad! Make sure to read the ${loaded.channels.rules} and get some cool ${loaded.channels.roles}.

If you're interested:
- We usually have giveaways going on in ${loaded.channels.giveaways}
- ${loaded.channels.br} contains helpful resources if you're just starting out
- If you're into CTFs check out ${loaded.members.ctfbot}
- If you want to participate in giveaways and the like, run \`;;role ping\`!

**Make sure to check out ${loaded.channels.jam} - we're running a contest for people of all skillsets with big prizes!**
  `.trim())
}

client.on('ready', async () => {
  console.log(`> Logged in as ${client.user.tag}`)
  client.user.setActivity('unverified members', { type: 'WATCHING' })

  loaded.guild = client.guilds.get('520444262685474816')

  loaded.roles.super = loaded.guild.roles.get('630212418072739861')
  loaded.roles.wandering = loaded.guild.roles.get('563143582765023232')
  loaded.roles.verified = loaded.guild.roles.get('520461398183247875')

  loaded.channels.info = loaded.guild.channels.get('559771387766505472')
  loaded.channels.countdown = loaded.guild.channels.get('572967189053702163')
  loaded.channels.lobby = loaded.guild.channels.get('520452924967747584')
  loaded.channels.roles = loaded.guild.channels.get('520466535198752778')
  loaded.channels.giveaways = loaded.guild.channels.get('577225038621704241')
  loaded.channels.br = loaded.guild.channels.get('520452891471773697')
  loaded.channels.rules = loaded.guild.channels.get('540370552200757248')
  loaded.channels.jam = loaded.guild.channels.get('621350573861502986')

  loaded.emojis.no = loaded.guild.emojis.get('630451133575331898')
  loaded.emojis.yes = loaded.guild.emojis.get('630451215037235213')
  loaded.emojis.pwncoin = loaded.guild.emojis.get('646199089951670293')
  loaded.members.ctfbot = loaded.guild.members.get('580257069760905216')


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
        } catch (error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        message += ` you have **1 day** left to send your verification message, and you're really close to being **kicked**. See ${loaded.channels.info} to learn more`
      } else {
        await member.kick()
        try {
          await member.send(`Sorry, but you've kicked from PwnSquad for not sending your verification message fast enough. In our defense, we warned you ahread of time! *If you want to try again feel free to join back*`)
        } catch (error) {
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
  if (
    message.member.roles.get(loaded.roles.wandering.id)
    && message.content.includes('81ZH2Y')
  ) {
    await message.delete()
    await message.member.ban('Nudes')
    return
  }

  if (message.content === '[[ test welcome ]]') {
    await welcome(message.member)
    return
  }

  const dumbContent = message.content.replace(/[^a-zA-Z\d:]+/g, '').toLowerCase()
  if (
    dumbContent === 'dontasktoask'
    || dumbContent === 'donotasktoask'
    || dumbContent === 'noaskingtoask'
  ) {
    await message.channel.send('https://pwnsquad.net/data/')
    return
  }

  if (!message.content.startsWith(prefix)) return

  if (message.content.startsWith(`${prefix}bal`)) {
    const user = message.mentions.users.first() || message.author
    const res = await fetch(apiUrl)
    const { balances } = await res.json()
    const balance = balances.find(({ id }) => id === user.id)
    const amount = balance ? balance.amount : 0

    await message.channel.send(`${user} has **${amount}** ${loaded.emojis.pwncoin}`)
  } else if (message.content.startsWith(`${prefix}lead`)) {
    const res = await fetch(apiUrl)
    const { balances } = await res.json()
    balances.sort((a, b) => a.amount > b.amount ? -1 : 1)

    const leaders = balances.slice(0, 10).map(({ id, amount }, index) => {
      return `${index + 1}. <@${id}> has **${amount}** PwnCoin`
    }).join('\n')

    await message.channel.send(`${loaded.emojis.pwncoin} **Leaderboard:**\n${leaders}`)
  } else if (message.content.startsWith(`${prefix}tot`)) {
    const res = await fetch(apiUrl)
    const { balances } = await res.json()
    const total = balances.reduce((p, c) => p += c.amount, 0)

    await message.channel.send(`There's **${total}** ${loaded.emojis.pwncoin} in circulation!`)
  }
  return

  if (!message.member.roles.get(loaded.roles.super.id)) return

  const members = message.mentions.members

  if (message.content.startsWith(`${prefix}verify`)) {
    if (members.size < 1) {
      await message.channel.send(`${loaded.emojis.no} You must specify a member to verify!`)
      return
    }

    for (let [_, member] of members) {
      if (member.roles.get(loaded.roles.verified.id)) {
        await message.channel.send(`${loaded.emojis.no} ${member} is already verified!`)
      } else {
        await member.removeRole(loaded.roles.wandering)
        await member.addRole(loaded.roles.verified)
        await message.channel.send(`${loaded.emojis.yes} ${member} has been verified.`)
        await welcome(member)
      }
    }
  } else if (message.content.startsWith(`${prefix}reject`)) {
    if (members.size < 1) {
      await message.channel.send(`${loaded.emojis.no} You must specify a member to reject!`)
      return
    }

    for (let [_, member] of members) {
      if (member.roles.get(loaded.roles.verified.id)) {
        await message.channel.send(`${loaded.emojis.no} ${member} is verified, so you can't reject them! You may want to kick them instead.`)
      } else {
        try {
          await member.send('Sorry, but your application has been rejected. If you think you can do better, join PwnSquad and try again.')
        } catch (error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        await member.kick()
        await message.channel.send(`${loaded.emojis.yes} ${member} has been rejected.`)
      }
    }
  }
})

client.login(process.env.BOT_TOKEN)
