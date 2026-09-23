const sequelize = require("../config/database");
const Autor = require("./Autor");
const Livro = require("./Livro");
const Categoria = require("./Categoria");
const Usuario = require("./Usuario");
const Emprestimo = require("./Emprestimo");

Autor.hasMany(Livro, { foreignKey: "autorId", onDelete: "RESTRICT" });
Livro.belongsTo(Autor, { foreignKey: "autorId" });

Livro.belongsToMany(Categoria, {
  through: "livro_categorias",
  foreignKey: "livroId",
  otherKey: "categoriaId",
  as: "categorias",
});
Categoria.belongsToMany(Livro, {
  through: "livro_categorias",
  foreignKey: "categoriaId",
  otherKey: "livroId",
  as: "livros",
});

Usuario.hasMany(Emprestimo, { foreignKey: "usuarioId", onDelete: "RESTRICT" });
Emprestimo.belongsTo(Usuario, { foreignKey: "usuarioId" });
Livro.hasMany(Emprestimo, { foreignKey: "livroId", onDelete: "RESTRICT" });
Emprestimo.belongsTo(Livro, { foreignKey: "livroId" });

module.exports = { sequelize, Autor, Livro, Categoria, Usuario, Emprestimo };
