import { Message, MessageEmbed } from 'discord.js'
import { BaseHandler } from './_base'
import { prefix } from '../config'
import fetch from 'node-fetch'

export class ImageHandler extends BaseHandler {
	_name = 'image'

	async onMessage(message: Message) {
		if (message.content.toLowerCase().startsWith(`${prefix}fox`)) {
			const res = await fetch('https://some-random-api.ml/img/fox')
			const json = await res.json()
			const embed = new MessageEmbed()
				.setTitle("Here's a random picture of a fox.")
				.setURL(json.link)
				.setImage(json.link)
				.setTimestamp(message.editedTimestamp)
				.setColor('#a839ed')
				.setFooter({
					text: `${message.author.username}#${message.author.discriminator}`,
					iconURL: message.author.displayAvatarURL(),
				})
			message.channel.send({ embeds: [embed] })
		}
		return false
	}
}
