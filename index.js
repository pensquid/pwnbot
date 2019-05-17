const Discord = require('discord.js')
const cron = require('node-cron')
const client = new Discord.Client()

client.on('ready', async () => {
  console.log(`> Logged in as ${client.user.tag}`)

  const guild = client.guilds.get('520444262685474816')
  const wanderingRole = guild.roles.get('563143582765023232')
  const superRole = guild.roles.get('520452795250507795')
  const infoChannel = guild.channels.get('559771387766505472')
  const messageChannel = guild.channels.get('572967189053702163')

  cron.schedule('0 8 * * *', async () => {
    console.log('> Checking users')
    wanderingRole.members.forEach(async (member) => {
      const timeSinceJoin = Date.now() - member.joinedTimestamp
      const daysSinceJoin = Math.floor(timeSinceJoin / 1000 / 60 / 60 / 24)
      const daysLeft = 7 - daysSinceJoin
      if (daysLeft >= 7) return

      let message = ''
      message += member.toString()
      if (daysLeft > 1) {
        message += ` you have **${daysLeft} days** left to send your verification message! See ${infoChannel} to learn how`
      } else if (daysLeft === 1) {
        try {
          await member.send(`Just a friendly reminder, you only have **1 day** left to become verified on PwnSquad or you'll be **kicked**! *Don't worry, all you have to do is tell us a little about yourself :)*`)
        } catch(error) {
          console.log(`> Couldn't send a DM to ${member.displayName}`)
        }
        message += ` you have **1 day** left to send your verification message, and you're really close to being **kicked**. See ${infoChannel} to learn more`
      } else {
        if (member.kickable) {
          await member.kick()
          try {
            await member.send(`Sorry, but you've kicked from PwnSquad for not sending your verification message fast enough. In our defense, we warned you ahread of time! *If you want to try again feel free to join back*`)
          } catch(error) {
            console.log(`> Couldn't send a DM to ${member.displayName}`)
          }
          return
        }
        message += ` should've been kicked, but I somehow failed. ${superRole} halp!!!`
      }
      await messageChannel.send(message)
    })
  })
})

client.login(process.env.TOKEN)