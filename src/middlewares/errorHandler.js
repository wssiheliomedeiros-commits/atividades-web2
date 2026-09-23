const AppError = require("../utils/AppError");

// Middleware central de tratamento de erros.
module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  // Corpo com JSON malformado
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }

  // Atenção: UniqueConstraintError herda de ValidationError, então vem primeiro.
  if (err.name === "SequelizeUniqueConstraintError") {
    const campos = err.errors.map((e) => e.path).filter(Boolean);
    return res.status(409).json({
      erro: "Já existe um registro com esse valor",
      campos,
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      erro: "Erro de validação",
      detalhes: err.errors.map((e) => ({ campo: e.path, mensagem: e.message })),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(409).json({
      erro: "Operação não permitida: o registro possui vínculos com outros dados",
    });
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
};
