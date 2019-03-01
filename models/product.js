const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     // need to check id because if not even if passed id is null
//     // this line below is changing null into an object
//     // and in save it's going into update path
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;

//     if (this._id) {
//       // Update product
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }

//     // need to return this "action" and then in controller I can use is as a Promise
//     return dbOp
//       .then(result => console.log(result))
//       .catch(err => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     // Normally find() is returning all documents from the collection
//     // so it can be millions of objects
//     // mongodb is giving back a cursor
//     // a handle to check step by step those documents
//     // instead just converting all of them into JS object
//     // if we know that there is only 100isch products then we can use toArray()
//     // otherwise it's better to use pagination
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(err => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDb();

//     return (
//       db
//         .collection("products")
//         // _id in mongo is not a string, it's a special data type implemented
//         // in BSON - Binary JSON - binary-encoded
//         // thats way we need to create this ObjectId from string before req
//         .find({ _id: new mongodb.ObjectId(prodId) })
//         // .next() is taking the last returned object, in our case the only one
//         // instead whole cursor
//         .next()
//         .then(product => {
//           return product;
//         })
//         .catch(err => console.log(err))
//     );
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: mongodb.ObjectId(prodId) })
//       .then(result => console.log("Deleted"))
//       .catch(err => console.log(err));
//   }
// }
// module.exports = Product;
