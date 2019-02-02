const path = require("path");

const express = require("express");

const adminData = require("./admin");

const router = express.Router();

// root
// GET
router.get("/", (req, res) => {
  console.log("shop.js", adminData.products);

  const products = adminData.products;

  res.render("shop", {
    products,
    pageTitle: "MySuperShop",
    path: "/"
  });
});

module.exports = router;
