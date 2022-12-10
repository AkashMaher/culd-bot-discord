const { SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Points!')
		.addStringOption(option =>
            option.setName('select_user')
                .setDescription('select user')
                // .setRequired(false)
        ),
	async execute(interaction) {
		await interaction.reply('points');
	},
};