const mongoose = require('mongoose');
const config = require('../config/config');

//MongoDB Options
const mongoOpts = {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true 
};

//Connect Method to MongoDBAtlas
const connectToMongoDBAtlas = async ()=>{
    await mongoose.connect(config.development.MONGO_URL,mongoOpts);
    console.log(`MongoDB connected!`);
}



module.exports = connectToMongoDBAtlas;