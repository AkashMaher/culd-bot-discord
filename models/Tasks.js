const mongoose = require('mongoose')
const { Schema,model } = mongoose;
const TaskModel = new Schema({
    task_id: {type:Number, required:true},
    user_id: {type:Number, required:true},
    user_name: {type:String, required:true},
    task_details: {
    task_name:{type:String, required:true},
    point: {type:Number, required:true},
    }
},{ timestamps: true })

module.exports = model('Tasks', TaskModel); 