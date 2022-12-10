const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtask')
		.setDescription('Add Task!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('discord')
                .setDescription('Add Discord Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Help in Discord Chat (20 Points)', value: 20 },
                        { name: 'Short Announcement (20 Points)', value: 20 },
                        { name: 'Long Announcement (40 Points)', value: 40 },
                        { name: 'AMA (40 Points)', value: 40 },
                        { name: 'Support Ticket (20 Points)', value: 20 },
                        { name: 'Manage Roles, Channels, Permissions, Bots (40 Points)', value: 40 },
                        { name: 'Use Culd PFPs Weekly (10 Points)', value: 10 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                
        .addSubcommand(subcommand =>
            subcommand
                .setName('twitter')
                .setDescription('Add Twitter Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Tweet Post (15 Points)', value: 15},
                        { name: 'Tweet Thread (40 Points)', value: 40 },
                        { name: 'Help Support (10 Points)', value: 10 },
                        { name: 'Like,Comments (05 Points)', value: 5 },
                        { name: 'AMA (40 Points)', value: 40 },
                        { name: 'Use Culd PFPs Weekly (10 Points)', value: 10 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                .addSubcommand(subcommand =>
            subcommand
                .setName('instagram')
                .setDescription('Add Instagram Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Instagram Post (20 Points)', value: 20 },
                        { name: 'Help Support (10 Points)', value: 10 },
                        { name: 'Design an image for IG (30 Points)', value: 30 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                .addSubcommand(subcommand =>
            subcommand
                .setName('design')
                .setDescription('Add Design Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Video for Tiktok (40 Points)', value: 40 },
                        { name: 'Video for Youtube (100 Points)', value: 100 },
                        { name: 'Design Image for IG (30 Points)', value: 30 },
                        { name: 'Design for a piece of clothing (40 Points)', value: 40 },
                        { name: 'Design a banner (40 Points)', value: 40 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                .addSubcommand(subcommand =>
            subcommand
                .setName('vip_benefits')
                .setDescription('Add VIP Benefits Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: '1 Free NFT (100 Points)', value: 100 },
                        { name: '10 WL Spots (50 Points)', value: 50 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                .addSubcommand(subcommand =>
            subcommand
                .setName('documents')
                .setDescription('Add Documents Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Write Contract Documents (100 Points)', value: 100 },
                        { name: 'Write Excel Documents (50 Points)', value: 50 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                )
                .addSubcommand(subcommand =>
            subcommand
                .setName('manage_dao_nfts')
                .setDescription('Add Manage DAO NFT Tasks')
                .addIntegerOption(option =>
                option.setName('sub_category')
                .setDescription('select sub category')
                .setRequired(true)
                .addChoices(
                        { name: 'Buy NFTs (50 Points)', value: 50 },
                        { name: 'Sell NFTs (50 Points)', value: 50 },
                        { name: 'List NFTs (30 Points)', value: 30 },
                        { name: 'Transfer NFTs (30 Points)', value: 30 },
                        { name: 'Short Update on DAO NFTs (30 Points)', value: 30 },
                        { name: 'Manage Smart Contracts (300 Points)', value: 300 },
                        { name: 'Investigate and share a valuable info (80 Points)', value: 80 },
                        )
                )
                .addStringOption(option =>
                    option.setName('task_detail')
                        .setDescription('Input Task Detail')
                        .setRequired(true)
                )
        
                ),
		
	async execute(interaction) {
		// await interaction.reply('Task Added');
	},
};