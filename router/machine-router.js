const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const Tool =  require('../models/machineSchema');
const User =  require('../models/userSchema');

//create tool


router.patch('/create',async(req,res,next) =>{
    const { toolName,fid,quantity,daysAvalible,price,image} = req.body;

    
    const user = await User.findById(fid);
    const fName = user.userName;
    let existingTool
    try {
         existingTool = await Tool.findOne({
            toolName:toolName
        })
    
    } catch  {
        const error =  new HttpError(
            'Failed to create. Please try again',
            500 
        );
        return next(error);  
    }

    if(!existingTool){

        const createTool =  new Tool({
            toolName,image
        })
        try{
            await createTool.save();
        }catch (err){
            const error =  new HttpError(
                'Failed to create , please try again.',
                500 
            );
            return next(err);
        }
    }
    const pushTool = {
        fName:fName,
        quantity:quantity,
        fid:fid,
        daysAvalible:daysAvalible,
        price:price,
    }
    
   existingTool.provider.push(pushTool);
    try {
        await existingTool.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({tools:existingTool.toObject({getters:true})} )
})



//getAllTools

router.get('/',async(req, res, next) =>{
    
    let allTools;
    try {
        allTools = await Tool.find();
    } catch (err) {
        const error =  new HttpError('Fetching tool failed, please try again later.',500);
        return next(error)
    }
    res.json({allTools:allTools.map(f => f.toObject({ getters : true})) })
});


//getToolById
router.get('/:id', async(req, res, next) =>{
    const id =  req.params.id;
    let tool
    try {
        tool = await Tool.findById(id);
    } catch (error) {
        return next(error)
    }

   if(!tool){
       const error=   new HttpError('Could not find tool.',404);
       return next(error0)
   }

   res.json({tool:tool.toObject({getters:true})} )
}) ;


// request tool
router.post('/request', async(req,res,next) =>{
    const { toolid,owenid,quantity,noOfDays,fid} = req.body;
    const owner = await User.findById(owenid);

    const request = await User.findById(fid);
    const fName = request.userName;

    let tool
    try {
        tool = await Tool.findById(toolid);
    } catch (error) {
        return next(error)
    }

    const requestTool={
        fName:fName,
        noOfDays:noOfDays,
        quantity:quantity,
        toolid:toolid,
        toolName:tool.toolName,
        fid:fid
    }
    console.log(requestTool)
    owner.pendingRequest.push(requestTool)
    try {
        await owner.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({owners:owner.toObject({getters:true})} )
})

//accept the request
router.post('/accept', async(req,res,next) =>{
    const { toolid,quantity,noOfDays,requestid,myId} = req.body;
    const owner = await User.findById(myId);

    const request = await User.findById(requestid);
    const fName = request.userName;

    let tool;
    let ownerTools;
    try {
        tool = await Tool.findById(toolid);
        
    } catch (error) {
        return next(error)
    }
    let provider = [];
    provider= tool.provider;
    
    ownerTools =  provider.find(p =>{ if (p.fid == myId) {
        return p
    } } )
    ownerTools.quantity = ownerTools.quantity - quantity;
   
    


    const acceptTool={
        toolName:tool.toolName,
        fName:fName,
        noOfDays:noOfDays,
        quantity:quantity,
        fid:requestid,
        toolid:toolid
    }
    owner.offeredTool.push(acceptTool);

  ///update pending requests
    try {
        await owner.save();
        await tool.save();
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({owners:owner.toObject({getters:true})} )
})


module.exports =  router;