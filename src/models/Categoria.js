const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O nome da categoria é obrigatório" },
        notEmpty: { msg: "O nome da categoria não pode ser vazio" },
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "categorias" }
);

module.exports = Categoria;
