const AppError = require("./AppError");

// Converte um parâmetro de rota em inteiro positivo ou lança 400.
module.exports = (valor, nome = "ID") => {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`${nome} inválido`, 400);
  }
  return id;
};
