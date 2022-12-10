const mongoose = require('mongoose')
const { Schema,model } = mongoose;
const UserModel = new Schema({
    user_id: {type:String, required:true},
    user_name: {type:String, required:true},
    total_points: {type:Number, required:true},
    tasks_done:{type:Number, required:true},
    tasks_yet:{type:Number, required:true},
},{ timestamps: true })

module.exports = model('User', UserModel);