const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectID = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity =
        updatedCartItems[cartProductIndex].quantity + 1;
    } else {
      updatedCartItems.push({
        productId: new ObjectID(product._id),
        quantity: 1
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectID(this.id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectID(userId) })
      .then(user => user)
      .catch(err => console.log(err));
  }
}

module.exports = User;
