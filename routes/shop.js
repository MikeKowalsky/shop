const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

// root
// GET
router.get("/", shopController.getIndex);

// /products
// GET
router.get("/products", shopController.getProducts);

// /cart
// GET
router.get("/cart", shopController.getCart);

// /checkout
// GET
router.get("/checkout", shopController.getCheckout);

module.exports = router;
