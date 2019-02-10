const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  Product.create({
    title,
    price,
    imageUrl,
    description
  })
    .then(result => {
      console.log("New product created");
      res.redirect("/admin/products");
    })
    .catch(err => console.log());
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      // if there is no product with this id -> better add the msg to the user
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(response => {
      console.log("Product updated");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => product.destroy())
    .then(result => {
      console.log(`Product with id ${prodId} removed`);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
