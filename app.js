const express = require('express');
const connectToMongoDBAtlas = require('./database/connection');
const openRouter = require('./routes/openRoutes');
const bodyParser = require('body-parser');
const app = express();

connectToMongoDBAtlas().catch(error=>{
    console.log('Error on mongo connection!');
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use('/',openRouter);

app.listen(3000,console.log('Server up and running!'));