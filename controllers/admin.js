const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;
  Product.findById(prodId, product => {
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
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products"
    });
  });
};
