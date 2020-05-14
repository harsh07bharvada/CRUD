const mongoose = require('mongoose');

const projectsSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
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
        unique:true
    },
    link:{
        type:String,
        required:true,
        unique:true
    }
});

const Project = mongoose.model('Project',projectsSchema);

module.exports = Project;