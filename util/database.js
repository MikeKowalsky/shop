const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const keys = require("./keys");

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://${keys.keys.MONGO_USER}:${
      keys.keys.MONGO_PASSWORD
    }@cluster0-idsge.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log("**** MongoDB connected");
      callback(client);
    })
    .catch(err => console.log(err));
};

module.exports = mongoConnect;
