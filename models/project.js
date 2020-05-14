const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true,
        unique:true
    }
});

const Project = mongoose.model('Project',projectSchema);

module.exports = Project;