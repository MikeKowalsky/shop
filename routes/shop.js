const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// root
// GET
router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
  console.log("shop.js", adminData.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
