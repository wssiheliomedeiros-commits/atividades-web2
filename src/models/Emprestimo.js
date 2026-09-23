const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Emprestimo = sequelize.define(
  "Emprestimo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    livroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataEmprestimo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dataDevolucao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ativo", "devolvido"),
      allowNull: false,
      defaultValue: "ativo",
    },
  },
  { tableName: "emprestimos" }
);

module.exports = Emprestimo;
