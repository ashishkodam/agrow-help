const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')


const DUMMY_Users = [
    {
        id:'1',
        name:'ashish',
        role:'2',
        password:''
    },
    {
        id:'2',
        name:'kodam',
        role:'1',
        password:''
    }

]

router.get('/',(req, res, next) =>{
    console.log('Get Rrequest in plaxes');
    res.json({message: 'It works!'})
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

router.post('/',(req,res, next) =>{
    const { name,role,password} = req.body;

    const createUser = {
        name,role,password
    }
    DUMMY_Users.push(createUser);

    res.status(201).json({message:'Created Succesfully'})
})



module.exports =  router;