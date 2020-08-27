#note, you may need to debug this file as it's most likely not fit for production
@client.command(aliases=['bug', 'report')
async def bug_report(ctx, bad_cmd, *, bug_mssg=None):
	location = 'https://discordapp.com/channels/'+str(ctx.guild.id)+'/'+str(ctx.channel.id)+'/'+str(ctx.message.id)
	chan = client.get_channel(bug_report_channel_ID)
	if bug_mssg==None:
		await ctx.send("You need to make a valid bug report message.")
	else:
			embed = discord.Embed(title="BUG!", description=f"From: `{ctx.message.author}` \n ID: `{ctx.message.author.id}`")	
			embed.add_field(name=f"Bad command: ***{bad_cmd}***", value=f"```\n{bug_mssg}\n```")
				
			embed.set_footer(text=f"Message link: {location}")
			await ctx.send("Report sent, thank you \:D")
			await chan.send(embed=embed)
		
@client.command()
async def suggestion(ctx, *, suggestion):
	location = 'https://discordapp.com/channels/'+str(ctx.guild.id)+'/'+str(ctx.channel.id)+'/'+str(ctx.message.id)
	chan = client.get_channel(suggestion_channel_ID)
	if suggestion==None:
		await ctx.send("You need to make a valid suggestion.")
	else:
			embed = discord.Embed(title="Suggestion!", description=f"From: `{ctx.message.author}` \n ID: `{ctx.message.author.id}`")	
				embed.add_field(name="You got a new suggestion!" value=f"```\n{suggestion}\n```")
				
				embed.set_footer(text=f"Message link: {location}")
				await ctx.send("Sent, thank you \:D")
				await chan.send(embed=embed)
		

os.run('TOKEN')
