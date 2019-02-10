const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "NodeComplete", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
