const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) =>
      res.render("shop/product-list", {
        products: rows,
        pageTitle: "All Products",
        path: "/products"
      })
    )
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) =>
      res.render("shop/product-detail", {
        product: product[0],
        path: "/products",
        pageTitle: product.title
      })
    )
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) =>
      res.render("shop/index", {
        products: rows,
        pageTitle: "Shop",
        path: "/"
      })
    )
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll()
      .then(([rows]) => {
        const cartProducts = [];
        rows.forEach(product => {
          const cartProductData = cart.products.find(
            prod => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty
            });
          }
        });

        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts
        });
      })
      .catch(err => console.log(err));

    // Product.fetchAll(products => {
    //   const cartProducts = [];
    //   products.forEach(product => {
    //     const cartProductData = cart.products.find(
    //       prod => prod.id === product.id
    //     );
    //     if (cartProductData) {
    //       cartProducts.push({ productData: product, qty: cartProductData.qty });
    //     }
    //   });

    //   res.render("shop/cart", {
    //     path: "/cart",
    //     pageTitle: "Your Cart",
    //     products: cartProducts
    //   });
    // });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(([product]) => {
      Cart.addProduct(prodId, product[0].price);
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(([product]) => {
      Cart.deleteProduct(prodId, product[0].price);
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};
