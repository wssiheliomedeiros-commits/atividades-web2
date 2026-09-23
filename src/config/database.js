const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const pastaBanco = path.join(__dirname, "..", "..", "database");
fs.mkdirSync(pastaBanco, { recursive: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(pastaBanco, "biblioteca.sqlite"),
  logging: false,
});

module.exports = sequelize;
