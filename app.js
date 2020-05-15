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

 app.use(cors()); 
  
app.use(express.json({extended:false}));

app.use(bodyParser.json({limit:'50mb'})); 

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 })); 

app.use(cookieParser());

connectToMongoDBAtlas().catch(error=>{
  console.log('Error on mongo connection!');
});

app.get('/',(req,res)=> {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


app.use('/',openRouter);
app.use('/',secureRouter);

app.listen(port,console.log('Server up and running!'));