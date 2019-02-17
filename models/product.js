const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();

    // need to return this "action" and then in controller I can use is as a Promise
    return db
      .collection("products")
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }
}
module.exports = Product;
