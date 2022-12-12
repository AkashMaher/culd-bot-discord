async function embedMsgHelp(fields,user) {
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
    const dataEmbed = {
	color: 0x4df85f,
	title: 'Help Bot Commands',
	// description: `**Bot Commands**`,
	thumbnail: {
		url: userAvatar,
	},
	fields:fields,
	timestamp: new Date().toISOString(),
	footer: {
		text: user.tag,
		icon_url: userAvatar,
	},
};
return dataEmbed
}

module.exports = {embedMsgHelp}