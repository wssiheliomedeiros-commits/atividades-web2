const BaseRepository = require("./BaseRepository");
const { Emprestimo, Usuario, Livro } = require("../models");

const INCLUDE_PADRAO = [
  { model: Usuario, attributes: ["id", "nome"] },
  { model: Livro, attributes: ["id", "titulo", "disponivel"] },
];

class EmprestimoRepository extends BaseRepository {
  constructor() {
    super(Emprestimo);
  }

  listar(options = {}) {
    return super.listar({ include: INCLUDE_PADRAO, order: [["id", "ASC"]], ...options });
  }

  buscarPorId(id, options = {}) {
    return super.buscarPorId(id, { include: INCLUDE_PADRAO, ...options });
  }
}

module.exports = new EmprestimoRepository();
