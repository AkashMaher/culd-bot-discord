const { ModalBuilder,TextInputBuilder,ActionRowBuilder,TextInputStyle  } = require('discord.js');

		const taskIdsInput = new TextInputBuilder()
			.setCustomId('taskIdsInput')
			.setLabel("Enter Task IDs (max 1 id per line)")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		const secondActionRow = new ActionRowBuilder().addComponents(taskIdsInput);

        
const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal')
            .addComponents(secondActionRow);

module.exports = modal;