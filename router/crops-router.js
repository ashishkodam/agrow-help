const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const Crop =  require('../models/cropSchema');
const User =  require('../models/userSchema');

//create Crop


router.post('/create',async(req,res,next) =>{
 
    const {cName} = req.body.send;
    let existingCrop
    try {
         existingCrop = await Crop.findOne({
            cName:cName
        })
    
    } catch (err) {
        const error =  new HttpError(
            'Failed to Create. Please try again',
            500 
        );
        return next(err);  
    }

    if(existingCrop){

        res.status(500).json({message:'Crop exists already.'})
    }
    const createCrop =  new Crop({
       cName
    })
    try{
        await createCrop.save();
    }catch (err){
        const error =  new HttpError(
            'creating Crop failed, please try again.',
            500 
        );
        return next(err);
    }
    res.status(201).json({crop:createCrop.toObject({getters:true})} )

})



//getAllCrops

router.get('/',async(req, res, next) =>{
    let allCrops;
    try {
        allCrops = await Crop.find();
    } catch (err) {
        const error =  new HttpError('Fetching crops failed, please try again later.',500);
        return next(error)
    }
    res.status(201).json({allCrops:allCrops.map(f => f.toObject({ getters : true})) })
    
});


//getcropsById
router.get('/:id', async(req, res, next) =>{
    const id =  req.params.id;
    let crop
    try {
        crop = await Crop.findById(id);
    } catch (error) {
        return next(error)
    }

   if(!crop){
       const error=   new HttpError('Could not find crop.',404);
       return next(error0)
   }

   res.status(201).json({crop:crop.toObject({getters:true})} )
}) ;


//post details

router.patch('/:cId', async (req, res, next) => {
    const {description,fid,ferilizer,weather,waterTiming} = req.body.data;
     const id =  req.params.cId;
    let cropsDetails;
    let user;
    try {
        cropsDetails = await Crop.findById(id);
        user = await User.findById(fid);
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error)
    }
    const fName = user.userName;

    const pushComment = {
        fName:fName,
        description:description,
        fid:fid,
        ferilizer:ferilizer,weather:weather,waterTiming:waterTiming,
        like:0
    }
    // console.log(cropsDetails)

    const cropProvide = {
        description:description,
        ferilizer:ferilizer,
        weather:weather,waterTiming:waterTiming,
        cName:cropsDetails.cName,
        cid:id
    }

    user.cropsDetails.push(cropProvide)
    cropsDetails.fInputs.push(pushComment);
    try {
        await cropsDetails.save();
        await user.save();
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.status(201).json({message:'Succesfully Posted'} )
})


router.post('/like', async (req, res, next) => {
    const {cid,Fiid} = req.body.data;
    let cropsDetails;
    try {
        cropsDetails = await Crop.findById(cid);
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error)
    }
    
    cropsDetails.fInputs.find(c => {if(c.id == Fiid) return c.like = c.like +1});
    try {
        await cropsDetails.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.status(201).json({message:'Post Liked'} )
})

router.post('/dislike', async (req, res, next) => {
    const {cid,Fiid} = req.body.data;
    let cropsDetails;
    try {
        cropsDetails = await Crop.findById(cid);
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error)
    }
    
    cropsDetails.fInputs.find(c => {if(c.id == Fiid) return c.like = c.like -1});
    try {
        await cropsDetails.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.status(201).json({message:'Post disliked'} )
})





module.exports =  router;