const fs = require('node:fs');
const path = require('node:path');
const { Client,Collection,Events ,GatewayIntentBits,WebhookClient,PermissionsBitField  } = require('discord.js');
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
				return await interaction.reply({content:"the requested user not found in the core team",ephemeral: false })
				}
			} 
			
            let user_details = await UserDetails(user,nickName,botAvatar,databaseName)
            // console.log(user_details)

			return await interaction.reply({embeds:[user_details], ephemeral: false })

			
				
			
        } else if ( command.data.name ==='addpoints'){ 
			if(!checkIfAdmin(interaction.user.id).message) return await interaction.reply({content:"You don't have access to add points",ephemeral:true})
			// if(interaction.user.id !== OwnerId) return await interaction.reply({content:"You don't have access to add points",ephemeral:true})
			const points = interaction.options._hoistedOptions?.[0].value
			const id = interaction.options._hoistedOptions?.[1].value
			const userId = id.startsWith("<@")?id.slice(2, -1):id;
			if(!checkIfuser(userId).message) return interaction.reply({ content: `The user not found in core team`, ephemeral: true })
			let msgData = await addPoints(checkIfuser(userId).user.user,{user_id:userId,points:points},databaseName)

			await log.send({embeds:[msgData],ephemeral:false})
			await interaction.reply({content:'Points Added',ephemeral:true})
			
		} else if ( interaction.commandName === 'addtask'){
			const points = interaction.options._hoistedOptions?.[0].value
			const taskName = interaction.options._hoistedOptions?.[1].value
			const category = interaction.options._subcommand
			let input = {user:interaction.user,taskName:taskName,points:points,category:category}
			
			let addTaskData = await addTasks(input,databaseName)
			// console.log(addTaskData)
			await log.send({embeds:[addTaskData], ephemeral: false })
			// await log.send(`Event: Task Add\n Task ID: ${addTaskData.task_id}\n User ID: ${addTaskData.user_id} \n User Name:${addTaskData.user_name}\nTASK DETAILS\n Task Category: ${addTaskData.task_details.category}\n Task Name: ${addTaskData.task_details.task_name}\n Points:${addTaskData.task_details.point}\n\nBy ${interaction.user.tag}`)
			await interaction.reply({content:'Task Added',ephemeral:true})
		} else if ( interaction.commandName === 'view-task'){
			const task_id = interaction.options._hoistedOptions?.[0].value
			let input = {user:interaction.user,task_id:task_id}
			
			let viewTaskData = await viewTask(input,databaseName)
			await interaction.reply({embeds:[viewTaskData], ephemeral: true })
		} else if ( interaction.commandName === 'approve-task'){
			if(!checkIfAdmin(interaction.user.id).message) return await interaction.reply({content:"You don't have access to approve tasks",ephemeral:true})
			const task_id = interaction.options._hoistedOptions?.[0].value
			let input = {user:interaction.user,task_id:task_id}

			let viewTaskData = await approveTask(input,databaseName)
			// console.log()
			let msg = viewTaskData.data
			if(viewTaskData.message !== 'success') return await interaction.reply({content:viewTaskData.message, ephemeral: true })
			await log.send({embeds:[msg], ephemeral: false })/
			// await log.send(`Event: Task Add\n Task ID: ${addTaskData.task_id}\n User ID: ${addTaskData.user_id} \n User Name:${addTaskData.user_name}\nTASK DETAILS\n Task Category: ${addTaskData.task_details.category}\n Task Name: ${addTaskData.task_details.task_name}\n Points:${addTaskData.task_details.point}\n\nBy ${interaction.user.tag}`)
			await interaction.reply({content:`Task Approved!`, ephemeral: true })
		}
		 else {
            await command.execute(interaction);
			
        }
		
        
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
keepAlive()
client.login(token);
