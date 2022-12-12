const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder ()
        .setName('approve-multiple')
		.setDescription('Approve Multiple Tasks by id'),
	async execute(interaction) {
        // Show the modal to the user
        // await interaction.reply('approve multiple tasks');
        
		
	},
};