const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { development:{saltingRounds} } = require('../config/config');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true,
        unique:true
    }
});

//Pre-Save Hook for UserSchema
userSchema.pre('save',function(next){

    let user = this;
    if(!user.isNew || !user.isModified)
    {
        let userPresentError = new Error();
        userPresentError.name = 'alreadyExists';
        userPresentError.message = 'User is either modified or already saved.';
        console.log(`@userSchema(pre-save hook) - ${userPresentError}`);
        next(userPresentError);
    }
    else
    {
        bcrypt.hash(user.password,saltingRounds,(err,hashedPassword)=>{
            if(err)
            {
                console.log(`@userSchema(pre-save hook) - ${err}`);
                next(err);
            }
            else
            {
                user.password = hashedPassword;
                next();
            }
        })
    }
});

//Post Save Hook for UserSchema
userSchema.post('save',function(doc){

    console.log(`@userSchema(post-save hook) - Saved the new user`);
});


const User = mongoose.model('User',userSchema);

module.exports = User;