const fs = require("fs");
const path = require("path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );

    // Read file -> for bigger files use read Stream
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      console.log("read err", err);
      console.log("read fileContent", fileContent);
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log("write err", err);
      });
    });
  }

  static fetchAll() {
    console.log("in fetch");
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );

    fs.readFile(p, (err, fileContent) => {
      if (err) return [];
      return JSON.parse(fileContent);
    });
  }
};
