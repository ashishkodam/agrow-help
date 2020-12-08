const express = require('express');
const router = express.Router();
const HttpError = require('../models/http-error')
const Tool = require('../models/machineSchema');
const User = require('../models/userSchema');

//create tool


router.patch('/create', async (req, res, next) => {
    let { toolName, fid, quantity, price } = req.body.data;
    console.log(req.body.data)
    let user;
    let fName;
    try {
        user = await User.findById(fid);
        fName = user.userName;
    } catch (error) {
        res.status(401).json({ message: error })
    }

    toolName =  toolName.charAt(0).toUpperCase() + toolName.slice(1);;
    let existingTool
    try {
        existingTool = await Tool.findOne({
            toolName: toolName
        })

    } catch {
        const error = new HttpError(
            'Failed to create. Please try again',
            500
        );
        return next(error);
    }
    
    console.log('existingTool',existingTool)
    if (!existingTool) {

        const createTool = new Tool({
            toolName
        })
        try {
            await createTool.save();
        } catch (err) {
            const error = new HttpError(
                'Failed to create , please try again.',
                500
            );
            return next(err);
        }
    }
    const pushTool = {
        fName: fName,
        quantity: quantity,
        fid: fid,
        price: price,
    }
    const provided = {
        toolName:toolName,
        quantity: quantity,
        price: price,
        toolid:existingTool.id,
        
    }
    await user.postedTools.push(provided)
    await existingTool.provider.push(pushTool);
    //console.log(user)
    try {
        await existingTool.save();
        await user.save();
    } catch (error) {
        const err = new HttpError('Something went wrong counld not update the comment, please try later.', 500)
        return next(error);
    }
    res.status(201).json({ message: 'Succesfully submited' })
})


router.patch('/update', async (req, res, next) => {
    let {  fid, price,toolName,quantity, toolId,postedTools } = req.body.data;
    let user;
    let updatetool;
    try {
        user = await User.findById(fid);
        updatetool = await Tool.findById(toolId);
    } catch (error) {
        res.status(500).json({ message: error })
    }


    const pushTool = {
        fName: user.userName,
        quantity: Number(quantity),
        fid: fid,
        price: price,
    }

    
   
    try {
         await  updatetool.provider.find(t=>{
             console.log(t.fid == fid)
             if(t.fid == fid){
                 t.fName = user.userName;
                 t.quantity = quantity;
                 t.fid = fid;
                 t.price =  price;
                 
             }
         }
        )

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong while updating. Please try later.' })
    }
    

    try {
        user.postedTools =  postedTools
   } catch {
       res.status(500).json({ message: 'Something went wrong while updating. Please try later.' })
   }

   console.log('tool', updatetool)

    try {
        await updatetool.save();
        await user.save();
    } catch (error) {
        const err = new HttpError('Something went wrong counld not update the comment, please try later.', 500)
        return next(error);
    }
    res.status(201).json({ message: 'Succesfully submited' })
})


//getAllTools

router.get('/', async (req, res, next) => {

    let allTools;
    try {
        allTools = await Tool.find();
    } catch (err) {
        const error = new HttpError('Fetching tool failed, please try again later.', 500);
        return next(error)
    }
    res.status(201).json({ allTools: allTools.map(f => f.toObject({ getters: true })) })
});


//getToolById
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    let tool
    try {
        tool = await Tool.findById(id);
    } catch (error) {
        return next(error)
    }

    if (!tool) {
        const error = new HttpError('Could not find tool.', 404);
        return next(error0)
    }

    res.status(201).json({ tool: tool.toObject({ getters: true }) })
});


// request tool
router.post('/request', async (req, res, next) => {
    const { toolid, owenid, quantity, noOfDays, fid } = req.body.data;
    const owner = await User.findById(owenid);

    const request = await User.findById(fid);
    const fName = request.userName;

    let tool
    try {
        tool = await Tool.findById(toolid);
    } catch (error) {
        return next(error)
    }

    const requestTool = {
        fName: fName,
        noOfDays: noOfDays,
        quantity: quantity,
        toolid: toolid,
        toolName: tool.toolName,
        fid: fid
    }
    console.log(requestTool)
    owner.pendingRequest.push(requestTool)
    try {
        await owner.save()
    } catch (error) {
        const err = new HttpError('Something went wrong counld not update the comment, please try later.', 500)
        return next(error);
    }
    
    res.status(201).json({ message: 'Request Successfull' })
})

//accept the request
router.post('/accept', async (req, res, next) => {
    const { toolid, quantity, noOfDays, requestid, myId } = req.body.data;
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
    // console.log("befor tool", tool)
    let provider = [];
    provider = tool.provider;

    ownerTools = provider.find(p => {
        if (p.fid == myId) {
            return p
        }
    })
    ownerTools.quantity = ownerTools.quantity - quantity;

    if (ownerTools.quantity === 0) {
        let index = tool.provider.indexOf(ownerTools);
        
        if (index > -1) {
            tool.provider.splice(index, index + 1);

        }

    }
    


    const acceptTool = {
        toolName: tool.toolName,
        fName: fName,
        noOfDays: noOfDays,
        quantity: quantity,
        fid: requestid,
        toolid: toolid
    }
    owner.offeredTool.push(acceptTool);

    ///update pending requests
    let ownerPr = owner.pendingRequest.find(pr => {
        if (pr.toolid == toolid) {
            return pr;
        }
    })
    let index = owner.pendingRequest.indexOf(ownerPr);

    if (index > -1) {
        owner.pendingRequest.splice(index, index + 1);

    }

    // console.log(" after tool", tool)

    try {
        await owner.save();
        await tool.save();
    } catch (error) {
        const err =  new HttpError('Something went wrong counld not update the comment, please try later.',500)
        return next(error);
    }
    res.status(201).json({owners:owner.toObject({getters:true})} )
})


//reject the request
router.post('/reject', async (req, res, next) => {
    const { toolid, myId } = req.body;
    const owner = await User.findById(myId);




    let ownerPr = owner.pendingRequest.find(pr => {
        if (pr.toolid == toolid) {
            return pr;
        }
    })
    let index = owner.pendingRequest.indexOf(ownerPr);

    if (index > -1) {
        owner.pendingRequest.splice(index, index + 1);
        console.log("index", index, owner);
    }

    ///update pending requests
    try {
        await owner.save();
    } catch (error) {
        const err = new HttpError('Something went wrong counld not update the comment, please try later.', 500)
        return next(error);
    }
    res.status(201).json({ owners: owner.toObject({ getters: true }) })
})


module.exports = router;