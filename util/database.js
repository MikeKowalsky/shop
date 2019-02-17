const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const keys = require("./keys");

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://${keys.keys.MONGO_USER}:${
      keys.keys.MONGO_PASSWORD
    }@cluster0-idsge.mongodb.net/shop?retryWrites=true`,
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log("**** MongoDB connected");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
