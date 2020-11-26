const { json } = require('body-parser');
const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const User =  require('../models/userSchema');



router.get('/',(req, res, next) =>{
    console.log('Get Rrequest in plaxes');
    res.json({message: DUMMY_Users})
});
// router.get('/:uid', );
router.get('/:uid', async(req, res, next) =>{
    const userId =  req.params.uid;

   

   let user
    try {
         user = await User.findById(userId)
    
    } catch  {
        const error =  new HttpError(
            'Somingthing went wrong. Please try again',
            500 
        );
        return next(error);  
    }

   if(!user){
       throw new HttpError('Could not find user.',404);
   }

   res.status(201).json({user:user.toObject({getters:true})} )
}) ;
 
 router.post('/signup', async (req,res, next) => {
     
    const { userName,email,role,password,} = req.body.data;
    let existingUser
    try {
         existingUser = await User.findOne({
            email:email
        })
    
    } catch (err) {
        const error =  new HttpError(
            'Sign up failed. Please try again',
            500 
        );
        return next(err);  
    }

    if(existingUser){

        res.status(500).json({message:'User exists already.'})
    }
   
    const createUser =  new User({
        email,role,password,userName
    })

    try{
        await createUser.save();
    }catch (err){
        const error =  new HttpError(
            'creating user failed, please try again.',
            500 
        );
        return next(err);
    }
     

    res.status(201).json({message:'Created Succesfully'})
})


router.post('/login', async (req,res, next) => {
    console.log(req.body)
    const { email,password} = req.body.data;

    let identifiedUser
    try {
         identifiedUser = await User.findOne({
            email:email
        })
    
    } catch (err) {
        const error =  new HttpError(
            'Login failed. Please try again',
            500 
        );
        return next(err);  
    }

    if(!identifiedUser || identifiedUser.password !==  password) return new HttpError('Email or password does not identified, try again',401)
    res.status(201).json({message:identifiedUser.toObject({getters:true})} )
});





module.exports =  router;