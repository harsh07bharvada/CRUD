const express = require('express');
const openRouter = express.Router();
const User = require('../models/user');

openRouter.post('/signup',(req,res)=>{
    
    let result = {};
    let status = 201;
    const {username, password} = req.body;
    const newUser = new User({username,password});
    newUser.save((err,savedUser)=>{

        if(err)
        {
            status = err.name === 'alreadyExists' ? 409 : 500;
            result.status = status;
            result.error = err;
        }
        else
        {
            result.status = status;
            result.result = savedUser;
        }
        res.status(status).send(result);
    });
    
});

module.exports = openRouter;