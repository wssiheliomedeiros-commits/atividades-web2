const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome é obrigatório" },
        notEmpty: { msg: "O nome não pode ser vazio" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O e-mail é obrigatório" },
        isEmail: { msg: "O e-mail está em formato inválido" },
      },
    },
  },
  { tableName: "usuarios" }
);

module.exports = Usuario;
