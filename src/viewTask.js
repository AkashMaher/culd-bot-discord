const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function viewTask(input,databaseName){
    const {user,task_id} = input
    let result = await mongoClient.connect();
    let db = result.db(databaseName);
    let taskCollection = db.collection('tasks');
    let data = await taskCollection.findOne({task_id:parseInt(task_id)});
    if(!data){
        return "Task not found"
    }
    return embedMsgTask(data,user);
}

async function embedMsgTask(data,user) {
    
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
    const dataEmbed = {
	color: data.status==='approved'?0x4df85f:0xffe221,
	title: 'EVENT',
	description: "**VIEW TASK**",
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
			name: '|  Approved Status',
			value: `|   ${data.status!=="await"?'Approved By :'+data?.approved_by:"Yet To Approve"}`,
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
return dataEmbed
}

module.exports = {viewTask}