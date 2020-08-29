import { Message, RichEmbed } from 'discord.js'
import { BaseHandler } from './_base'
import { prefix } from '../config'
import fetch from 'node-fetch'
const apiArray = [
    'https://some-random-api.ml/img/fox',
    'https://some-random-api.ml/img/cat',
    'https://some-random-api.ml/img/panda',
    'https://some-random-api.ml/img/dog',
    'https://some-random-api.ml/img/koala',
    'https://some-random-api.ml/img/birb',
    'https://some-random-api.ml/img/red_panda'
]

export class ImageHandler extends BaseHandler {
    _name = 'image'

    async onInit() {}
    async onJoin() { return false }
    async onLeave() { return false }

    async onMessage(message: Message) {
        if (message.content.toLowerCase().startsWith(`${prefix}animal`)) {
            const type = message.content.split(" ")[1]
            let res, title
            switch (type) {
                case 'fox':
                    res = await fetch('https://some-random-api.ml/img/fox')
                    title = 'Here\'s a random picture of a fox.'
                    break
                case 'cat':
                    res = await fetch('https://some-random-api.ml/img/cat')
                    title = 'Here\'s a random picture of a cat.'
                    break
                case 'panda':
                    res = await fetch('https://some-random-api.ml/img/panda')
                    title = 'Here\'s a random picture of a panda.'
                    break
                case 'doggie':
                case 'doggo':
                case 'dog':
                    res = await fetch('https://some-random-api.ml/img/dog')
                    title = 'Here\'s a random picture of a dog.'
                    break
                case 'rpanda':
                case 'redpanda':
                    res = await fetch('https://some-random-api.ml/img/red_panda')
                    title = 'Here\'s a random picture of a red panda.'
                    break
                case 'birb':
                case 'bird':
                    res = await fetch('https://some-random-api.ml/img/birb')
                    title = 'Here\'s a random picture of a bird.'
                    break
                case 'koala':
                    res = await fetch('https://some-random-api.ml/img/koala')
                    title = 'Here\'s a random picture of a koala.'
                    break
                default:
                    const random = Math.floor(Math.random() * apiArray.length)
                    res = await fetch(apiArray[random])
                    title = 'Here\'s a random picture of an animal.'
                    break
            }
            const json = await res.json()
            const embed = new RichEmbed()
                .setTitle(title)
                .setURL(json.link)
                .setImage(json.link)
                .setTimestamp(message.editedTimestamp)
                .setColor('#a839ed')
                .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL)
            message.channel.send(embed)
        }
        return false
    }
}