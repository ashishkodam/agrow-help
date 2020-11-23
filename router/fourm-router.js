const express =  require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const Forum =  require('../models/forumSchema');
const User =  require('../models/userSchema');


//// get all questions
router.get('/',async(req, res, next) =>{
    
    let allQuestions;
    try {
        allQuestions = await Forum.find();
    } catch (err) {
        const error =  new HttpError('Fetching forum failed, please try again later.',500);
        return next(error)
    }
    res.json({allQuestions:allQuestions.map(f => f.toObject({ getters : true})) })
});




/// get questions by id
router.get('/:id', async(req, res, next) =>{
    const id =  req.params.id;
    let forum
    try {
        forum = await Forum.findById(id);
    } catch (error) {
        return next(error)
    }

   if(!forum){
       const error=   new HttpError('Could not find forum.',404);
       return next(error0)
   }

   res.json({forum:forum.toObject({getters:true})} )
}) ;
 

/// create a question
router.post('/create',async(req,res,next) =>{
    const { fid,question} = req.body;

    const user = await User.findById(fid);
    const fName = user.userName;

    const createQuestion =  new Forum({
        fid,fName,question
    })
    console.log(createQuestion)
    try{
        await createQuestion.save();
    }catch (err){
        const error =  new HttpError(
            'Failed to create question, please try again.',
            500 
        );
        return next(err);
    }
     

    res.status(201).json({message:'Created Succesfully'})
})


// comment 


router.patch('/:forumid', async (req, res, next) => {
    const {comment,fid} = req.body;
     const id =  req.params.forumid;
    let forum;
    let user;
    try {
        forum = await Forum.findById(id);
        user = await User.findById(fid);
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(err)
    }
    const fName = user.userName;

    const pushComment = {
        fName:fName,
        comment:comment,
        fid:fid
    }
   // console.log(forum)
    forum.comments.push(pushComment);
    try {
        await forum.save()
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.json({forum:forum.toObject({getters:true})} )
})

module.exports =  router;