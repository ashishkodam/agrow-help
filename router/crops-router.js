const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const Crop =  require('../models/cropSchema');
const User =  require('../models/userSchema');

//create Crop


router.post('/create',async(req,res,next) =>{
    const {cName} = req.body;
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
    res.json({crop:createCrop.toObject({getters:true})} )

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
    res.json({allCrops:allCrops.map(f => f.toObject({ getters : true})) })
    
});


//getcropsById
router.get('/:id', async(req, res, next) =>{
    const id =  req.params.id;
    let crops
    try {
        crops = await Crop.findById(id);
    } catch (error) {
        return next(error)
    }

   if(!crops){
       const error=   new HttpError('Could not find crops.',404);
       return next(error0)
   }

   res.json({crops:crops.toObject({getters:true})} )
}) ;


//post details

router.patch('/:cId', async (req, res, next) => {
    const {description,fid,ferilizer,weather,waterTiming} = req.body;
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
    console.log(cropsDetails)
    cropsDetails.fInputs.push(pushComment);
    try {
        await cropsDetails.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({cropsDetails:cropsDetails.toObject({getters:true})} )
})


router.post('/like', async (req, res, next) => {
    const {cid,id} = req.body;
    let cropsDetails;
    try {
        cropsDetails = await Crop.findById(cid);
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error)
    }
    
    cropsDetails.fInputs.find(c => {if(c.id == id) return c.like = c.like +1});
    console.log(cropsDetails)
    try {
        await cropsDetails.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({cropsDetails:cropsDetails.toObject({getters:true})} )
})





module.exports =  router;