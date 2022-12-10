const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function addTasks(input,databaseName){
    const {user,taskName,points,category} = input
    let result = await mongoClient.connect();
    let db = result.db(databaseName);
    let collection = db.collection('user');
    let taskCollection = db.collection('tasks');
    let totalTasks = (await taskCollection.countDocuments()).toString()
    let data = await collection.findOne({ user_id: user.id });
    if(!data){
        await collection.insertOne({user_id:user.id,user_name:user.tag, total_points:0,tasks_done:0,tasks_yet:0})
        data = await collection.findOne({ user_id: user.id });
    }
    totalTasks = parseInt(totalTasks)
    await taskCollection.insertOne({
        task_id:totalTasks+1,
        user_id: input.user.id,
        user_name: input.user.tag,
        status:'await',
        task_details: {
            category:category,
            task_name:taskName,
            point: points,
        }})
    await collection.findOneAndUpdate({ user_id: user.id },{$set:{tasks_yet:data.tasks_yet+1}})
    totalTasks = (await taskCollection.countDocuments()).toString()
    let taskData = await taskCollection.findOne({task_id:parseInt(totalTasks)})
    return embedMsgTask(taskData,user);
}

async function embedMsgTask(data,user) {
    
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
    const dataEmbed = {
	color: 0xffe221,
	title: 'EVENT',
	description: "TASK ADD",
	thumbnail: {
		url: userAvatar,
	},
	fields: [
		
		// {
		// 	name: '\u200b',
		// 	value: '\u200b',
		// 	inline: false,
		// },
        {
			name: '\u200b',
			value: 'TASK DETAIL',
			inline: false,
		},
		{
			name: "Task Status ",
			value: `${data.status}`,
			inline: true
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
			name: '|  Category',
			value: `|   ${data?.task_details.category}`,
			inline: true,
		},
		{
			name: '|  Task Id',
			value: `|   ${data?.task_id}`,
			inline: true,
		},
		{
			name: '|  Points',
			value: `|   ${data?.task_details.point}`,
			inline: true,
		},
		{
			name: '|  Task Name',
			value: `|   ${data?.task_details.task_name}`,
			inline: false,
		},
	],
	timestamp: new Date().toISOString(),
	footer: {
		text: user.tag,
		icon_url: userAvatar,
	},
};
return dataEmbed;
}


module.exports = {addTasks}
