const path = require("path");

const express = require("express");

// const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// root
// GET
router.get("/", (req, res) => {
  console.log("shop.js", adminData.products);

  // without rootDir
  // res.sendFile(path.join(__dirname, "..", "views", "shop.html"));

  // with rootDir
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  // templating engine
  // default templating engine and path is set up
  const products = adminData.products;

  // // PUG
  // res.render("shop", { products, pageTitle: "MySuperShop", path: "/" });

  // // HANDLEBARS
  // // need to add logic because hbs doesn't provide this
  // // basically no way to use any JS expressions in hbs files
  // // if I want not to use layout I need to add layout: flase to the object
  // res.render("shop", {
  //   products,
  //   pageTitle: "MySuperShop",
  //   productCSS: true,
  //   hasProducts: products.length > 0,
  //   activeShop: true
  // });

  // EJS
  res.render("shop", {
    products,
    pageTitle: "MySuperShop",
    path: "/"
  });
});

module.exports = router;
