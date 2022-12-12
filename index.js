const fs = require('node:fs');
const path = require('node:path');
const { Client,Collection,Events ,GatewayIntentBits,WebhookClient,PermissionsBitField,InteractionType  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const keepAlive = require("./server.js");
require('dotenv').config({ path: '.env' })
const wait = require('node:timers/promises').setTimeout;
// const request = require('request');
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose')
const token = process.env['token']
const OwnerId = process.env['OwnerId']
const clientId = process.env['client_id']
const guildId = process.env['guild_id']
const mongourl = process.env['mongourl']
const pointLogToken = process.env['pointLogToken']
const pointLogId = process.env['pointLogId']
const coreTeamRole = process.env['coreTeamRole']
const UserModel = require('./models/User');
const TaskModel = require('./models/Tasks')

const {UserDetails} = require('./src/userdetails');
const {addPoints} = require('./src/addPoints')
const {addTasks} = require('./src/addTasks')
const {viewTask} = require('./src/viewTask')
const {approveTask} = require('./src/approveTask')
const {embedMsgApprove} = require('./src/embedMsg')
const {embedMsgHelp} = require('./src/helpEmbed')
const modal = require('./src/modal')

// const { collection } = require('./meta.js');
// MongoDB part
const log = new WebhookClient({id:pointLogId,token:pointLogToken});

client.commands = new Collection();

mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then( (db) => {
        db.model('User')
        
        console.log(`connected to mongodb`) 
    });
mongoose.set('strictQuery', true);
const mongodb = mongoose.connection;

mongodb.on('error', console.error.bind(console, 'Connection error:'));

const mongoClient = new MongoClient(mongourl);
const databaseName = "workspace";

const commands = [
    {
    "name": "rarity",
    "type": 1,
    "description": "culd rarity checker",
    "options": [
        {
            "name": "check_by",
            "description": "choose option for rarity checke",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "Rank",
                    "value": "culd_rank"
                },
                {
                    "name": "TokenId",
                    "value": "culd_token_id"
                }
            ]
        },
        {
            "name": "input",
            "description": "input number",
            "type": 3,
            "required": true
        }
    ]
},
  {
  name:'culd',
  description: 'check dao nfts!'
},
];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    commands.push(command.data.toJSON());
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}




const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


client.on(Events.ClientReady, () => {
  const Guilds = client.guilds.cache.size;
  const totalMembers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

  console.log(Guilds, totalMembers)
  console.log(`Logged in as ${client.user.tag}!`);

   client.user.setActivity(`culd.org`, { type: 'PLAYING' })
});



function checkIfuser(userId){
	let guild = client.guilds.cache.get(guildId)
	let user = guild.members.cache.get(userId)
	if(!user){
		return false
	}
	let checkIfuserHasRole = user._roles.includes(coreTeamRole)
	return {
		message:checkIfuserHasRole?true:false,
		user:user,
	}
}

function checkIfAdmin(userId){
	let guild = client.guilds.cache.get(guildId)
	let user = guild.members.cache.get(userId)
	if(!user){
		return false
	}
	let checkIfuserHasRole = user.permissions.has(PermissionsBitField.Flags.Administrator);
	return {
		message:checkIfuserHasRole?true:false,
		user:user,
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if(interaction.replied) return console.log("already replied");
    let nickName = await interaction.member.nickname
	const command = interaction.client.commands.get(interaction.commandName);
	let botAvatar = client.user.displayAvatarURL({ size: 1024, dynamic: true });
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		if(!checkIfuser(interaction.user.id).message) return interaction.reply({ content: `don't have permission to execute the command`, ephemeral: true });

        if(command.data.name==='rarity'|| command.data.name==='culd') return;

        if(command.data.name ==='points'){
			await interaction.reply({content:"Fetching User Details...",ephemeral:true})
			const id = interaction?.options?._hoistedOptions?.[0]?.value
			let user= interaction.user
			let userId
			if(id) {
				userId = id.startsWith("<@")?id.slice(2, -1):id;
				if(checkIfuser(userId).message){
					user =await checkIfuser(userId).user.user
					nickName = user.nickName
					// console.log(user)
				} else {
				return await interaction.editReply({content:"the requested user not found in the core team",ephemeral: false })
				}
			} 
			
            let user_details = await UserDetails(user,nickName,botAvatar,databaseName)
            // console.log(user_details)

			return await interaction.editReply({content:`User Details: ${user.tag}`,embeds:[user_details], ephemeral: false })

			
				
			
        } else if ( command.data.name ==='addpoints'){ 
			if(!checkIfAdmin(interaction.user.id).message) return await interaction.reply({content:"You don't have access to add points",ephemeral:true})
			await interaction.reply({content:"Point Adding",ephemeral:true})
			// if(interaction.user.id !== OwnerId) return await interaction.reply({content:"You don't have access to add points",ephemeral:true})
			const points = interaction.options._hoistedOptions?.[0].value
			const id = interaction.options._hoistedOptions?.[1].value
			const userId = id.startsWith("<@")?id.slice(2, -1):id;
			if(!checkIfuser(userId).message) return interaction.reply({ content: `The user not found in core team`, ephemeral: true })
			let msgData = await addPoints(checkIfuser(userId).user.user,{user_id:userId,points:points},databaseName)

			 await interaction.editReply({content:"Point Added",embeds:[msgData],ephemeral:true})
			 log.send({embeds:[msgData],ephemeral:false})
			 
			//  interaction.reply("Point Added")
			
		} else if ( interaction.commandName === 'addtask'){
			await interaction.reply({content:"Task adding",ephemeral:true})
			const points = interaction.options._hoistedOptions?.[0].value
			const taskName = interaction.options._hoistedOptions?.[1].value
			const category = interaction.options._subcommand
			let input = {user:interaction.user,taskName:taskName,points:points,category:category}
			
			let addTaskData = await addTasks(input,databaseName)
			// console.log(addTaskData)
			await interaction.editReply({content:"Task Added",embeds:[addTaskData], ephemeral:true})
			log.send({embeds:[addTaskData], ephemeral: false })
			 
			
		} else if ( interaction.commandName === 'view-task'){
			await interaction.reply({content:'searching tasks', ephemeral: true })
			const task_id = interaction.options._hoistedOptions?.[0].value
			let input = {user:interaction.user,task_id:task_id}
			
			let viewTaskData = await viewTask(input,databaseName)
			 await interaction.editReply({content:`Task Details: ${task_id}`,embeds:[viewTaskData], ephemeral: true })

		} else if ( interaction.commandName === 'approve-task'){
			console.log(interaction.replied)
			if(interaction.replied) return console.log("already replied");
			if(!checkIfAdmin(interaction.user.id).message) return await interaction.reply({content:"You don't have access to approve tasks",ephemeral:true})
			await interaction.reply({content:"Task Approving",ephemeral:true})
			const task_id = interaction.options._hoistedOptions?.[0].value
			let input = {user:interaction.user,task_id:task_id,approve_by:interaction.user.tag}

			let viewTaskData = await approveTask(input,databaseName)
			// console.log()
			let msg = viewTaskData.data
			if(viewTaskData.message !== 'success') return await interaction.editReply({content:viewTaskData.message, ephemeral: true })
			await interaction.editReply({content:"Task Approved",embeds:[msg],ephemeral:true})
			log.send({embeds:[msg], ephemeral: false })
			// await log.send(`Event: Task Add\n Task ID: ${addTaskData.task_id}\n User ID: ${addTaskData.user_id} \n User Name:${addTaskData.user_name}\nTASK DETAILS\n Task Category: ${addTaskData.task_details.category}\n Task Name: ${addTaskData.task_details.task_name}\n Points:${addTaskData.task_details.point}\n\nBy ${interaction.user.tag}`)

		} else if ( interaction.commandName === 'approve-multiple'){
			console.log(interaction.replied)
			await interaction.showModal(modal);
			const filter = (interaction) => interaction.customId === 'myModal';
			interaction.awaitModalSubmit({ filter, time: 180000 })
			.then(async interaction => {
				
				let ids = interaction.fields.getField('taskIdsInput').value.split('\n')
				
				ids = ids.sort().filter(function(el,i,a){return i===a.indexOf(el)})
				console.log(ids)
				console.log(`${interaction.customId} was submitted!`)

				if (interaction.type === InteractionType.ModalSubmit) {
				console.log('Modal Submitted...');
				if (interaction.customId === 'myModal') {
				console.log(interaction.fields.getTextInputValue('taskIdsInput')[0]);
				interaction.reply({
					content: 'Approve Multiple Tasks!',
					ephemeral:true
				});
				}
				let embedfields = []
				console.log(ids.length)
				if(ids.length>0){
					let j = 0;
					for(i=0;i<ids.length;i++){
						const task_id = parseInt(ids[i])
						if(!isNaN(task_id)){
							
							console.log(task_id)
							let input = {user:interaction.user,task_id:task_id,approve_by:interaction.user.tag}
							let viewTaskData = await approveTask(input,databaseName)
							let msg = viewTaskData.data
							if(viewTaskData.message !== 'success') {
							embedfields[j] = {name:`Task Id: ${task_id}`,value:`Status: ${viewTaskData.message}`};
							} else {
							embedfields[j] = {name:`Task Id: ${task_id}`,value:"Status: Task Approved"};
							log.send({embeds:[msg], ephemeral: false })
							}
							j++
						} else {
							if(embedfields.length===0){
								embedfields[0] = {name:"Status",value:"No Entries Found"}
							}
						}
						
						
						// console.log(embedfields[i])
					}
					// console.log(embedfields)
					if(embedfields.length>0){
					let embedData = await embedMsgApprove(embedfields,interaction.user)
					await interaction.editReply({content:'Task approve',embeds:[embedData],ephemeral:true})
					} else {
						await interaction.editReply({content:'No Entries found',ephemeral:true})
					}
					
				}
			}
				
				
			})
			.catch(console.error);
			// await interaction.reply('approve multiple tasks')
		} else if(interaction.commandName === 'culd-help'){
			let embedfields = []
			await interaction.client.commands.filter((a)=> {
				// console.log(a.data.name)
				let i = embedfields.length
				embedfields[i] = {name:`Command : \`/${a.data.name}\``, value:`**Usage :** ${a.data.description}`}
			})
			// console.log(embedfields)
			
			if(embedfields.length>0){
					let embedData = await embedMsgHelp(embedfields,interaction.user)
					await interaction.reply({content:'Help Commands',embeds:[embedData],ephemeral:true})
					} else {
						await interaction.reply({content:'No Commands found',ephemeral:true})
					}
		}
		 else {
            await command.execute(interaction);
			
        }

		
		
        
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on(Events.interaction, async (modal) => {
    if (!modal.customId === 'myModal') return;
	console.log(modal)
    await modal.reply({ content: 'Your order was received successfully!', ephemeral: true });
    const IGN = modal.getTextInputValue('minecraft_ign');
    const Weapon = modal.getSelectMenuValue('weapon_type');
    const ownedWeapon = modal.getSelectMenuValue('owned_weapon');
    const ownedTanks = modal.getSelectMenuValue('owned_tanks');
    const wantedTanks = modal.getSelectMenuValue('wanted_tanks');
    console.log({IGN, Weapon, ownedWeapon, ownedTanks, wantedTanks})
})


keepAlive()
client.login(token);
