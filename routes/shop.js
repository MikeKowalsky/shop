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

// /cart
// POST
router.post("/cart", shopController.postCart);

// /cart-delete-item
// POST
// Delete item from cart
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// // /create-order
// // POST
// router.post("/create-order", shopController.postOrder);

// // /orders
// // GET
// router.get("/orders", shopController.getOrders);

module.exports = router;
