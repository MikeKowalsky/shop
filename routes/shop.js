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

// with dynamic routs order again maters, because eg /products/delete looks like delete is :productId
// /products/0.2342342
// GET
router.get("/products/:productId", shopController.getProduct);

// /cart
// GET
router.get("/cart", shopController.getCart);

// /orders
// GET
router.get("/orders", shopController.getOrders);

// /checkout
// GET
router.get("/checkout", shopController.getCheckout);

module.exports = router;
