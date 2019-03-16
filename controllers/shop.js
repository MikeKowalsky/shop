const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");
// const User = require("../models/user");

const keys = require("../util/keys");

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(keys.keys.STRIPE_KEY);

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(productNumber => {
      totalItems = productNumber;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product =>
      res.render("shop/product-detail", {
        product,
        path: "/products",
        pageTitle: product.title
      })
    )
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(productNumber => {
      totalItems = productNumber;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
    .then(result => res.redirect("/cart"))
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => res.redirect("./cart"))
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let totalSum = 0;
      products.forEach(p => (totalSum += p.quantity * p.productId.price));

      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products,
        totalSum
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express

  // (async () => {
  //   const charge = await stripe.charges.create({
  //     amount: 999,
  //     currency: "usd",
  //     description: "Example charge",
  //     source: token
  //   });
  // })();

  let totalSum = 0;

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      user.cart.items.forEach(
        p => (totalSum += p.quantity * p.productId.price)
      );

      const products = user.cart.items.map(i => ({
        quantity: i.quantity,
        product: { ...i.productId._doc } //to retrieve whole data not only id, which will be default behavior
      }));
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });
      return order.save();
    })
    .then(result => {
      const charge = stripe.charges.create({
        amount: totalSum * 100,
        currency: "usd",
        description: "Demo order",
        source: token,
        metadata: { order_id: result._id.toString() }
      });

      return req.user.clearCart();
    })
    .then(() => res.redirect("/orders"))
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then(orders =>
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders
      })
    )
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error("No order found."));
      if (order.user.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized"));

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();

      //need to set up headers first
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);

      // want to save it on the server
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // and send it to the user
      pdfDoc.pipe(res);

      // now whatever I will put into the Doc will be streamed
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true
      });
      pdfDoc.text(" ");
      pdfDoc.fontSize(16).text(`Order id: #${orderId}`);
      pdfDoc.text("-----------------------------");
      pdfDoc.text(" ");

      let totalPrice = 0;

      order.products.forEach((prod, i) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.text(
          `${i} - ${prod.product.title} - ${prod.quantity} x $${
            prod.product.price
          }`
        );
      });

      pdfDoc.text(" ");
      pdfDoc.text(`Total price: $${totalPrice}`);
      pdfDoc.end();

      // read the whole file into memory and than send
      // with bigger file and traffic this will kill the server
      //
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) return next(err);
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      //   res.send(data);
      // });

      // so recomended way is to use chunks and buffers
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      // file.pipe(res);
    })
    .catch(err => next(err));
};
