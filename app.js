const express = require('express');
const connectToMongoDBAtlas = require('./database/connection');
const app = express();

connectToMongoDBAtlas().catch(error=>{
    console.log('Error on mongo connection!');
});


app.listen(3000,console.log('Done'));