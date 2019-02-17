const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products =>
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products
      })
    )
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // product.cartItem is giving as access to the cart through this between table
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        //will be automatically wrapped in a Promise
        return product;
      }
      return Product.findById(prodId);
    })
    .then(product => {
      // addProduct is also added by sequelize, we just need to add second field qty
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: prodId } }))
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => res.redirect("./cart"))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              console.log(product.cartItem.quantity);
              product.orderItem = { quantity: product.cartItem.quantity };
              console.log(product);
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => fetchedCart.setProducts(null))
    .then(result => res.redirect("/orders"))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    // concept called EAGER loading
    // we are asking about array of orders with products inside
    // we can do this because there is a relation setup between orders and products
    .getOrders({ include: ["products"] })
    .then(orders =>
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders
      })
    )
    .catch(err => console.log(err));
};
