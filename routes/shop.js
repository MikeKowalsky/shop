const path = require("path");

const express = require("express");
const rootDir = require("../util/path");

const router = express.Router();

// root
// GET
router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
