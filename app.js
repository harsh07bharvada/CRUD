const express = require('express');
const connectToMongoDBAtlas = require('./database/connection');
const openRouter = require('./routes/openRoutes');
const secureRouter = require('./routes/secureRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

connectToMongoDBAtlas().catch(error=>{
    console.log('Error on mongo connection!');
});

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/',(req,res)=> {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.use('/',openRouter);
app.use('/',secureRouter);

app.listen(port,console.log('Server up and running!'));