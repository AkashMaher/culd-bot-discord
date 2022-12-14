const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('culd')
		.setDescription('Check DAO NFTs!'),
	async execute(interaction) {
		// await interaction.reply('Pong!');
	},
};