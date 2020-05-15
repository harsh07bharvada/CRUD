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

const whitelist = ['http://localhost:3000', 'https://sidie.now.sh/']
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));    
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