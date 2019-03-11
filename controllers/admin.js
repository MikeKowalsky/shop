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

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });

  product
    .save()
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
  Product.findById(prodId)
    .then(product => {
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

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString())
        return res.redirect("/");
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      // need to nest this then here because this first if, don't want to continue
      return product.save().then(response => {
        console.log("Product updated");
        res.redirect("/admin/products");
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") // !!! query projection
    // .populate("userId", "name") // populate userId but only with name (from the all user object)
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
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log(`Product with id ${prodId} removed`);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
