import { Message, RichEmbed } from 'discord.js'
import { BaseHandler } from './_base'
import { prefix, foxapi } from '../config'
import fetch from 'node-fetch'

export class ImageHandler extends BaseHandler {
    _name = 'image'
    
    async onInit() {}
    async onJoin() { return false }
    async onLeave() { return false }

    async onMessage(message: Message) {
        if (message.content.toLowerCase().startsWith(`${prefix}fox`)) {
            let api = await (await fetch(foxapi)).json();
            let embed = new RichEmbed()
                .setTitle("Heres a random fox picture")
                .setURL(api.link)
                .setImage(api.link)
                .setTimestamp(message.editedTimestamp)
                .setColor('#a839ed')
                .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL);
            message.channel.send(embed);
        }
        
        return false;
    }
}