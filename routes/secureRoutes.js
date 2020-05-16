const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Project = require('../models/project');
const {development :{jwtSecret}} = require('../config/config');
const config = require('../config/config');
const secureRouter = express.Router();

//Middleware to check for token
secureRouter.use(async(req,res,next)=>{

    let result = {};
    let status = 401;
    console.log('req headers');
    console.log(req.headers);
    const bearerToken = req.header('authorization');
    const token = bearerToken.split(" ")[1];
    console.log(token);
    if(token == null || token == undefined)
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
        if(username == null || username == undefined)
        {
            result.status = status;
            result.error = tokenErr;
            res.status(result.status).send(result);
        }
        else if(!config.getBlacklistTokens().includes(token))
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
        else
        {
            let err = new Error();
            err.name = 'Unauthorized';
            err.message = 'Blacklisted token used';
            result.status = status;
            result.error = err;
            res.status(result.status).send(result);
        }
    }
});

//Create a project
secureRouter.post('/project',async (req,res)=>{

    let result = {};
    let statusCode = 201;
    const {name,description,status,link} = req.body;
    const bearerToken = req.header('authorization');
    const token = bearerToken.split(" ")[1];
    console.log(`Token received : ${token}`);
    const {username} = await verifyToken(token);
    const project = new Project({username,name,description,status,link});
    
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


//Get all project
secureRouter.get('/getProjects',async (req,res)=>{

    let result = {};
    let statusCode = 200;
    const bearerToken = req.header('authorization');
    const token = bearerToken.split(" ")[1];
    console.log(`Token received : ${token}`);
    const {username} = await verifyToken(token);
    
    Project.find({username},(projectErr,projects)=>{

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
            result.result = projects;
            res.status(result.status).send(result);
        }

    });
});


//Update a project
secureRouter.put('/project',async (req,res)=>{

    let result = {};
    let statusCode = 200;
    const {_id,name,description,status,link} = req.body;
    Project.updateOne({_id},{name,description,status,link},(projectErr,writeOpResult)=>{

        if(projectErr)
        {
            statusCode = 404;
            result.status = statusCode;
            result.error = projectErr;
            res.status(result.status).send(result);
        }
        else
        {
            result.status = statusCode;
            result.result = writeOpResult;
            res.status(result.status).send(result);
        }

    });

});

//Delete a project
secureRouter.delete('/project',async (req,res)=>{

    let result = {};
    let statusCode = 200;
    const {_id} = req.body;
    Project.deleteOne({_id},(projectErr)=>{

        if(projectErr)
        {
            statusCode = 404;
            result.status = statusCode;
            result.error = projectErr;
            res.status(result.status).send(result);
        }
        else
        {
            result.status = statusCode;
            res.status(result.status).send(result);
        }

    });

});


//Sign out
secureRouter.get('/signout',async (req,res)=>{

    let statusCode = 200;
    let result = {statusCode};
    const bearerToken = req.header('authorization');
    const token = bearerToken.split(" ")[1];
    console.log(`Token received : ${token}`);
    config.updateBlacklistTokens(token);
    res.clearCookie('token').status(statusCode).send(result);

});


//Function to verify token
const verifyToken = async (token) =>{

    let result = {err:null,username:null};
    try{
        const decrypt = await jwt.verify(token, jwtSecret);
        const username = decrypt.username;
        result.username = username;
        return result;

    }
    catch(err)
    {
        err.name = 'Unauthorized';
        err.message = 'Token invalid!';
        console.log(`Error while verifying token. Invalid token`);
        result.err = err;
        console.log(`@verifyToken - Object sending back : ${result}`);
        return result;
    }
}


module.exports = secureRouter;