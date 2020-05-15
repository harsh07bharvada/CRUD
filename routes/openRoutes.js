const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const openRouter = express.Router();
const User = require('../models/user');
const {development:{jwtSecret}} = require('../config/config');


//Sign Up router
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

//Sign In router
openRouter.post('/signin',(req,res)=>{

    let result = {};
    let status = 200; 
    console.log('request body');
    console.log(req.body);
    res.status(status).send(result);
    const {username,password} = req.body;
    const signedUser = {username,password};
    try{
        User.findOne({username: username},function(err,doc){

            if(err)
            {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(result.status).send(result);
            }
            else
            {
                console.log(`doc : ${doc}`);
                bcrypt.compare(password,doc.password)
                .then(match=>{
                    if(match)
                    {
                        const expiration = '2d';
                        const token = generateToken(username,expiration);
                        result.status = status;
                        result.token = token;
                        result.result = signedUser;
                        res.status(result.status).cookie('token', token, {
                            expires: new Date(Date.now() + expiration),
                            secure: false, // set to true if your using https
                            httpOnly: true,
                          }).send(result);
                    }
                    else
                    {
                        status = 401;
                        result.status = status;
                        result.error = 'Authentication Error';
                        res.status(result.status).send(result);
                    }
                })
                .catch(err=>{
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                });
            }
        });
    }
    catch(reqErr)
    {
        status = 401;
        result.status = status;
        result.error = reqErr
        res.status(result.status).send(result);
    }
    
});

//Generate Token
const generateToken=(username,expiration)=>{

    const payload = { username:username};
    const options = { expiresIn :expiration};
    const secret = jwtSecret;
    return jwt.sign(payload, secret, options);

}
module.exports = openRouter;