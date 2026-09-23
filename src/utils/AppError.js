// Erro "esperado" da aplicação (ex.: 404, 409). O errorHandler converte em resposta HTTP.
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

module.exports = AppError;
