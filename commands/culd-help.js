const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('culd-help')
		.setDescription('Get All Commands!'),
	async execute(interaction) {
		await interaction.reply('cmds!');
	},
};