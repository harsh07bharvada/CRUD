const mongoose = require('mongoose');
const config = require('config');

//MongoDB Options
const mongoOpts = {
    useNewUrlParser:true,
    useUnifiedTopology:true
};

//Connect Method to MongoDBAtlas
const connectToMongoDBAtlas = async ()=>{

    await mongoose.connect(config.MONGO_URL,mongoOpts);
    
}



module.exports = connectToMongoDBAtlas;