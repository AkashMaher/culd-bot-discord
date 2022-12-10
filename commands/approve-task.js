const { SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve-task')
		.setDescription('Approve Task!')
		.addIntegerOption(option =>
            option.setName('task_id')
                .setDescription('Input Task Id')
                .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.reply('points');
	},
};