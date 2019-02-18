const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // Update product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    // need to return this "action" and then in controller I can use is as a Promise
    return dbOp
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    // Normally find() is returning all documents from the collection
    // so it can be millions of objects
    // mongodb is giving back a cursor
    // a handle to check step by step those documents
    // instead just converting all of them into JS object
    // if we know that there is only 100isch products then we can use toArray()
    // otherwise it's better to use pagination
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    // .next() is taking the last returned object, in our case the only one
    // instead whole cursor
    return (
      db
        .collection("products")
        // _id in mongo is not a string, it's a special data type implemented
        // in BSON - Binary JSON - binary-encoded
        // thats way we need to create this ObjectId from string before req
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next()
        .then(product => {
          console.log(product);
          return product;
        })
        .catch(err => console.log(err))
    );
  }
}
module.exports = Product;
