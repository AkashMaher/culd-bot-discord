const MongoClient = require("mongodb").MongoClient;
const mongourl = process.env['mongourl']
const mongoClient = new MongoClient(mongourl);

async function approveTask(input,databaseName){
    const {user,task_id,approve_by} = input
    let result = await mongoClient.connect();
    let db = result.db(databaseName);
    let collection = db.collection('user');
    let taskCollection = db.collection('tasks');
    let totalTasks = (await taskCollection.countDocuments()).toString()
    totalTasks = parseInt(totalTasks)
    let TaskData = await taskCollection.findOne({task_id:task_id,status:'await'})
    if(task_id>totalTasks || task_id<=0) {
        return {
            message:'The task with input task_id is not found'
        }
    }
    if(!TaskData ){
        return {
            message:'Task is already approved'
        }
    }
    let data = await collection.findOne({ user_id: TaskData.user_id });
    

    let task_done = data.tasks_done===0?1:data.tasks_done+1
    console.log(task_done)
    await collection.findOneAndUpdate({ user_id: TaskData.user_id },{$set:{tasks_yet:data.tasks_yet>0?data.tasks_yet-1:data.tasks_yet,tasks_done:task_done,total_points:data.total_points+TaskData.task_details.point}});
    await taskCollection.findOneAndUpdate({task_id:task_id,status:'await'},{$set:{status:'approved',approved_by:approve_by}})
    

    let taskData = await taskCollection.findOne({task_id:parseInt(task_id)})
    return {
        message:'success',
        data:await embedMsgTask(taskData,user)
    };
}

async function embedMsgTask(data,user) {
    
    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });
    const dataEmbed = {
	color: 0x4df85f,
	title: 'EVENT',
	description: "Task Approved",
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
return dataEmbed;
}


module.exports = {approveTask}
