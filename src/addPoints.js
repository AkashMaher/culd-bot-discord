const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function addPoints(user,input,databaseName){
    let result = await mongoClient.connect();
    let db = result.db(databaseName);
    let collection = db.collection('user');
    
    let data = await collection.findOne({ user_id: input?.user_id });
    if(!data){
        await collection.insertOne({user_id:user.id,user_name:user.tag, total_points:0,tasks_done:0,tasks_yet:0})
        data = await collection.findOne({ user_id: input?.user_id });
    }
    let total = parseInt(input.points)+data.total_points
    await collection.findOneAndUpdate({ user_id: user?.id },{$set:{total_points:(total)}})
    data = await collection.findOne({ user_id: input?.user_id });
    return await embedMsgTask(data,user,input.points)
}

async function embedMsgTask(data,user,point) {
    
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
    const dataEmbed = {
	color: 0x00ffef,
	title: 'EVENT',
	description: "Point Added",
	thumbnail: {
		url: userAvatar,
	},
	fields: [
		
        {
			name: '\u200b',
			value: 'Point Add Details',
			inline: false,
		},
		{
			name: '|  User Name',
			value: `|   ${data.user_name}`,
			inline: true,
		},
		{
			name: '|  User ID',
			value: `|   ${data.user_id}`,
			inline: true,
		},
		{
			name: '|  Points Added',
			value: `|   ${point}`,
			inline: true,
		}
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: user.tag,
		icon_url: userAvatar,
	},
};
return dataEmbed;
}

module.exports = {addPoints}
