const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Project = require('../models/project');
const {development :{jwtSecret}} = require('../config/config');
const secureRouter = express.Router();

//Middleware to check for token
secureRouter.use(async(req,res,next)=>{

    
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
        const {tokenErr,username} = await verifyToken(token);
        console.log(`Middleware tokenerr: ${tokenErr} and username : ${username}`);
        if(tokenErr)
        {
            result.status = status;
            result.error = tokenErr;
            res.status(result.status).send(result);
        }
        else 
        {
            User.findOne({username:username},function(findError,doc){
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

secureRouter.post('/project',async (req,res,next)=>{

    let result = {};
    let statusCode = 201;
    const {name,description,status,link} = req.body;
    const token = req.cookies.token;
    const {err,username} = await verifyToken(token);
    console.log(`username : ${username}`);
    const project = new Project({username,name,description,status,link});
    console.log(`project model : ${project}`);
    project.save((projectErr,savedProject)=>{

        if(projectErr)
        {
            statusCode = 406;
            result.status = statusCode;
            result.error = projectErr;
            res.status(result.status).send(result);
        }
        else
        {
            result.status = statusCode;
            result.result = savedProject;
            res.status(result.status).send(result);
        }

    });

});

//Function to verify token
const verifyToken = async (token) =>{

    let result = {err:null,username:null};
    try{
        const decrypt = await jwt.verify(token, jwtSecret);
        const username = decrypt.username;
        console.log(`Username retrieved from token : ${username}`);
        result.username = username;
        return result;

    }
    catch(err)
    {
        err.name = 'Unauthorized';
        err.message = 'Token invalid!';
        console.log(`Error while verifying token. Invalid token`);
        result.err = err;
        return result;
    }
}


module.exports = secureRouter;