const { ObjectId, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const validater =  require('mongoose-unique-validator')

const schema  =  mongoose.Schema;


const forumschema = new schema({
    toolName:{type:String,required:true, unique:true},
    image: {data: Buffer, contentType: String,required:false},
    provider:[
        {
           
            fName:{type:String, required:true},
            quantity:{type:Number,required:true},
            fid:{type:ObjectId,required:true},
            daysAvalible:{type:String,required:false},
            price:{type:String,required:true}
           
        }
    ],   
}) 
forumschema.plugin(validater);

module.exports =  mongoose.model('tools',forumschema)