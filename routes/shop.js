const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

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
router.get("/cart", isAuth, shopController.getCart);

// /cart
// POST
router.post("/cart", isAuth, shopController.postCart);

// /cart-delete-item
// POST
// Delete item from cart
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// /checkout
// GET
router.get("/checkout", isAuth, shopController.getCheckout);

// /orders
// GET
router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
