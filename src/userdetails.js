
const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function UserDetails(user,nickName,botAvatar,databaseName){
    let result = await mongoClient.connect();
    let db = result.db(databaseName);
    let collection = db.collection('user');
    let data = await collection.findOne({ user_id: user?.id });
    if(!data){
        collection.insertOne({user_id:user.id,user_name:user.tag, total_points:0,tasks_done:0,tasks_yet:0})
        data = await collection.findOne({ user_id: user?.id });
		console.log(data)
        return await embedMsgUserDetails(data,user,nickName,botAvatar)
		
    } else {
		data = await collection.findOne({ user_id: user?.id });
		return await embedMsgUserDetails(data,user,nickName,botAvatar)
	}
}
async function embedMsgUserDetails(data,user,nickName,botAvatar) {
    
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
	let username = nickName?`${user.tag}  ( ${nickName} )`:`${user.tag} `
    const dataEmbed = {
	color: 0x0099ff,
	title: 'Culd Team',
	url: 'https://culd.org',
	author: {
		name: 'Culd Bot',
		icon_url: botAvatar,
		url: 'https://culd.org',
	},
	description: "User Points",
	thumbnail: {
		url: userAvatar,
	},
	fields: [
		{
			name: "User Name : "+username,
			value: `**User ID : ${user.id}**`,
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: '|  TOTAL POINTS',
			value: `|   ${data?.total_points?data.total_points:0}`,
			inline: true,
		},
		{
			name: '|  TASKS DONE',
			value: `|   ${data?.tasks_done}`,
			inline: true, 
		},
		{
			name: '|  YET TO APPROVE',
			value: `|   ${data?.tasks_yet?data?.tasks_yet:0}`,
			inline: true,
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: user.tag,
		icon_url: userAvatar,
	},
};
return dataEmbed
}

module.exports = {UserDetails}
