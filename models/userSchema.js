const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const validater =  require('mongoose-unique-validator')

const schema  =  mongoose.Schema;


const userschema = new schema({
    userName: {type:String, required:true},
    email :{type:String, required:true, unique:true},
    role:{type:String, required:true}, 
    password:{type:String, required:true,minlength:6},
    offeredTool:[
        {
            toolName:{type:String, required:true},
            image: {data: Buffer, contentType: String,required:false},
            fName:{type:String,required:true},
            noOfDays:{ type:String,required:true},
            quantity:{ type:String,required:true},
            fid:{type:ObjectId,required:true},
            toolid:{type:ObjectId,required:true}
        }
    ],
    pendingRequest:[
        {
            fName:{type:String,required:true},
            noOfDays:{ type:String,required:true},
            quantity:{ type:String,required:true},
            toolName:{type:String, required:true},
            image: {data: Buffer, contentType: String,required:false},
            toolid:{type:ObjectId,required:true},
            fid:{type:ObjectId,required:true}
        }
    ]
    
}) 
userschema.plugin(validater);

module.exports =  mongoose.model('users',userschema)