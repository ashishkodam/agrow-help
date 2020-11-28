const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const validater =  require('mongoose-unique-validator')

const schema  =  mongoose.Schema;


const forumschema = new schema({
    fName:{type:String,required:true},
    fid:{type:ObjectId,required:true},
    question: {type:String, required:true},
    comments:[
        {
            fName:{type:String, required:true},
            comment:{type:String,required:true},
            fid:{type:ObjectId,required:true}
           
        }
    ],   
}) 
forumschema.plugin(validater);

module.exports =  mongoose.model('forum',forumschema)