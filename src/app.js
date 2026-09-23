const express = require("express");
const { sequelize } = require("./models");
const errorHandler = require("./middlewares/errorHandler");

const autorRoutes = require("./routes/autorRoutes");
const livroRoutes = require("./routes/livroRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const emprestimoRoutes = require("./routes/emprestimoRoutes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ mensagem: "API da Biblioteca no ar" }));

app.use("/autores", autorRoutes);
app.use("/livros", livroRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/emprestimos", emprestimoRoutes);

app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada" }));
app.use(errorHandler);

async function iniciar() {
  const porta = process.env.PORT || 3000;
  try {
    await sequelize.authenticate();
    console.log("Conexão com o SQLite estabelecida.");

    await sequelize.sync(); 
    console.log("Tabelas sincronizadas.");

    app.listen(porta, () => console.log(`Servidor rodando em http://localhost:${porta}`));
  } catch (erro) {
    console.error("Não foi possível iniciar a aplicação:", erro);
    process.exit(1);
  }
}

if (require.main === module) iniciar();

module.exports = app;
