const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
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
  res.render("shop");
});

module.exports = router;
