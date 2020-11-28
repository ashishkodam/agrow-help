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
            noOfDays:{ type:String,required:false},
            quantity:{ type:Number,required:true},
            fid:{type:ObjectId,required:true},
            toolid:{type:ObjectId,required:true}
        }
    ],
    pendingRequest:[
        {
            fName:{type:String,required:true},
            noOfDays:{ type:String,required:false},
            quantity:{ type:Number,required:true},
            toolName:{type:String, required:true},
            image: {data: Buffer, contentType: String,required:false},
            toolid:{type:ObjectId,required:true},
            fid:{type:ObjectId,required:true}
        }
    ],
    postedTools:[
        {
            price:{type:String,required:true},
            toolName:{type:String, required:true},
            image: {data: Buffer, contentType: String,required:false},
            quantity:{ type:Number,required:true},
            toolid:{type:ObjectId,required:true},
        }
    ],
    cropsDetails:[
        {
            description:{type:String,required:true},
            ferilizer:{type:String,required: true},
            weather:{type:String,required: true},
            waterTiming:{type:String,required: true},
            cName:{type:String,required:true},
            cid:{type:ObjectId,required:true}
        }
    ],
    requestMessage:[
        {
            fName:{type:String,required:true},
            fid:{type:ObjectId,required:true},
            message:{type:String,required:true}
        }
    ]
    
    
}) 
userschema.plugin(validater);

module.exports =  mongoose.model('users',userschema)