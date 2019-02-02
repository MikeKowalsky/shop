const path = require("path");

const express = require("express");
const rootDir = require("../util/path");

const router = express.Router();

const products = [];

// /admin/add-product
// GET
router.get("/add-product", (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
  // res.sendFile(path.join(roo tDir, "views", "add-product.html"));
  res.render("add-product", { pageTitle: "Add product" });
});

// /admin/add-product
// POST
router.post("/add-product", (req, res) => {
  console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect("/");
});

// ---> if I'm exporting one thing
// module.exports = router;
// ---> now I want to export 2 different variables
exports.routes = router;
exports.products = products;
// ---> of course I need to change imports now in app.js
