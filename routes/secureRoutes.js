const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {development :{jwtSecret}} = require('../config/config');
const secureRouter = express.Router();

//Middleware to check for token
secureRouter.use((req,res,next)=>{

    let result = {};
    let status = 401;
    const token = req.cookies.token;
    if(!token)
    {
        let err = new Error();
        err.name = 'Unauthorized';
        err.message = 'Token not present!';
        result.status = status;
        result.error = err;
        res.status(result.status).send(result);
    }
    else
    {
        const {err,username} = verifyToken(token);
        if(err)
        {
            result.status = status;
            result.error = err;
            res.status(result.status).send(result);
        }
        else 
        {
            User.findOne({username:username},function(err,doc){
                if(findError)
                {
                    result.status = status;
                    result.error = findError;
                    res.status(result.status).send(result);
                }
                else
                {
                    next();
                }
            });
        }
    }
});



//Function to verify token
const verifyToken = async (token) =>{

    try{
        const decrypt = await jwt.verify(token, jwtSecret);
        const username = decrypt.username;
        console.log(` Username retrieved from token : ${username}`);
        return {err:null,username};

    }
    catch(err)
    {
        let err = new Error();
        err.name = 'Unauthorized';
        err.message = 'Token invalid!';
        console.log(`Error while verifying token. Invalid token`);
        return {err,username:null};
    }
}