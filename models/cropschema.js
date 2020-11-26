const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const validater =  require('mongoose-unique-validator')

const schema  =  mongoose.Schema;


const cropschema = new schema({
    cName:{type:String,required:true},
    fInputs:[
        {
            fName:{type:String, required:true},
            description:{type:String,required:true},
            fid:{type:ObjectId,required:true},
            ferilizer:{type:String,required: true},
            weather:{type:String,required: true},
            waterTiming:{type:String,required: true},
            like:{type:Number,required:false}
           
        }
    ],   
}) 
cropschema.plugin(validater);

module.exports =  mongoose.model('crops',cropschema)