const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const User =  require('../models/userSchema');



router.get('/',(req, res, next) =>{
    console.log('Get Rrequest in plaxes');
    res.json({message: DUMMY_Users})
});
// router.get('/:uid', );
router.get('/:uid', (req, res, next) =>{
    const userId =  req.params.uid;

   const user =  DUMMY_Users.find(p =>{
       return p.id ==  userId
   });

   if(!user){
       throw new HttpError('Could not find user.',404);
   }

   res.json({user:user} )
}) ;
 
 router.post('/signup', async (req,res, next) => {
    const { userName,email,role,password,} = req.body;
    let existingUser
    try {
         existingUser = await User.findOne({
            email:email
        })
    
    } catch  {
        const error =  new HttpError(
            'Sign up failed. Please try again',
            500 
        );
        return next(error);  
    }

    if(existingUser){
        const error = new HttpError(
            'User exists already.',420
        );
        return next(error)
    }
   
    const createUser =  new User({
        email,role,password,userName
    })
    console.log(createUser)
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
    const { email,password} = req.body;

    let identifiedUser
    try {
         identifiedUser = await User.findOne({
            email:email
        })
    
    } catch  {
        const error =  new HttpError(
            'Login failed. Please try again',
            500 
        );
        return next(error);  
    }

    if(!identifiedUser || identifiedUser.password !==  password) return new HttpError('Email or password does not identified, try again',401)
    res.json({message:identifiedUser})
});





module.exports =  router;