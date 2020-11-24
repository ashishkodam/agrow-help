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
        res.status(500).json({message:'Fetching forum failed, please try again later.'});
    }
    res.status(201).json({allQuestions:allQuestions.map(f => f.toObject({ getters : true})) })
});




/// get questions by id
router.get('/:id', async(req, res, next) =>{
    const id =  req.params.id;
    let forum
    try {
        forum = await Forum.findById(id);
    } catch (error) {
        res.status(500).json({message:'Fetching forum failed, please try again later.'});
    }

   if(!forum){
    res.status(404).json({message:'Fetching forum failed, please try again laterCould not find forum.'});
   }

   res.status(201).json({forum:forum.toObject({getters:true})} )
}) ;
 

/// create a question
router.post('/create',async(req,res,next) =>{
    const { fid,question} = req.body.data;

    const user = await User.findById(fid);
    const fName = user.userName;

    const createQuestion =  new Forum({
        fid,fName,question
    })
    console.log(createQuestion)
    try{
        await createQuestion.save();
    }catch (err){
        res.status(500).json({message:'Failed to create question, please try again.'});
    }
     

    res.status(201).json({message:'Created Succesfully'})
})


// comment 


router.patch('/:forumid', async (req, res, next) => {
    const {comment,fid} = req.body.data;
     const id =  req.params.forumid;
    let forum;
    let user;
    try {
        forum = await Forum.findById(id);
        user = await User.findById(fid);
    } catch (error) {
        res.status(500).json({message:'Something went wrong counld not update the comment, please try later..'});
    }
    const forname = user.userName;
    //console.log('forname',forname)
    const pushComment = {
        fName:forname,
        comment:comment,
        fid:fid
    }
    
    forum.comments.push(pushComment);
    try {
        await forum.save()
    } catch (error) {
        res.status(500).json({message:'Something went wrong counld not update the comment, please try later.'});
    }
    res.status(201).json({forum:forum.toObject({getters:true})} )
})

module.exports =  router;