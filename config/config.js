const fs = require('fs');
const path = require('path');

const config = {
  development: {
    MONGO_URL:"mongodb+srv://harsh07bharvada:gelato%4007@crudmongodb-t7ak7.mongodb.net/crud-jwt?retryWrites=true&w=majority",
    port: process.env.PORT || 3000,
    saltingRounds: 10,
    jwtSecret:'kaboom',
    blacklistTokens:[]
  },

  updateBlacklistTokens:function(token){
    
      try {
        fs.writeFileSync(path.join(__dirname, './blacklistTokens.txt'), token+",");
      } catch (err) {
        console.error(err)
      }
    
  },

  getBlacklistTokens:function(){

      try {
        return fs.readFileSync(path.join(__dirname, './blacklistTokens.txt'));
      } catch (err) {
        console.error(err)
      }
  }
}


module.exports = config;