
module.exports = {
    development: {
      MONGO_URL:"mongodb+srv://harsh07bharvada:gelato%4007@crudmongodb-t7ak7.mongodb.net/crud-jwt?retryWrites=true&w=majority",
      port: process.env.PORT || 3000,
      saltingRounds: 10
    }
  }