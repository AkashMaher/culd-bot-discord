const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpoints')
		.setDescription('Add Points!')
		.addStringOption(option =>
            option.setName('input_number')
                .setDescription('how many points do you wants to add')
                .setRequired(true)
        )
		.addUserOption(option =>
            option.setName('select_user')
                .setDescription('select user')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason for adding manually')
                .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.reply('Point Added');
	},
};