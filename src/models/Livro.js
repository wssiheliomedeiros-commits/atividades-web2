const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Livro = sequelize.define(
  "Livro",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O título é obrigatório" },
        notEmpty: { msg: "O título não pode ser vazio" },
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O ISBN é obrigatório" },
        notEmpty: { msg: "O ISBN não pode ser vazio" },
      },
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "O ano é obrigatório" },
        isInt: { msg: "O ano deve ser um número inteiro" },
      },
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "O autorId é obrigatório" },
      },
    },
  },
  { tableName: "livros" }
);

module.exports = Livro;
