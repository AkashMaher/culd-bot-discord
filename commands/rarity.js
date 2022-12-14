const { SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('rarity')
		.setDescription('culd rarity checker')
		.addStringOption(option =>
            option.setName('check_by')
                .setDescription('choose option for rarity checker')
                .setRequired(true)
                .addChoices(
                    { name: 'Rank', value: 'culd_rank' },
                    { name: 'TokenId', value: 'culd_token_id' },
                )
        )
        .addIntegerOption(option =>
            option.setName('input')
                .setDescription('Input number')  
                .setRequired(true)
        ),
	async execute(interaction) {
		// await interaction.reply('rarity');
	},
};