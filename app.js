const express = require('express');
const connectToMongoDBAtlas = require('./database/connection');
const openRouter = require('./routes/openRoutes');
const secureRouter = require('./routes/secureRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

connectToMongoDBAtlas().catch(error=>{
    console.log('Error on mongo connection!');
});

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use('/',openRouter);
app.use('/',secureRouter);

app.listen(3000,console.log('Server up and running!'));