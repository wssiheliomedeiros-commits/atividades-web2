const CategoriaRepository = require("../repositories/CategoriaRepository");
const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "descricao"];

class CategoriaService {
  criar(dados) {
    return CategoriaRepository.criar(pick(dados, CAMPOS));
  }

  listar() {
    return CategoriaRepository.listar({ order: [["id", "ASC"]] });
  }

  async buscarPorId(id) {
    const categoria = await CategoriaRepository.buscarPorId(id);
    if (!categoria) throw new AppError("Categoria não encontrada", 404);
    return categoria;
  }

  async atualizar(id, dados) {
    const categoria = await CategoriaRepository.atualizar(id, pick(dados, CAMPOS));
    if (!categoria) throw new AppError("Categoria não encontrada", 404);
    return categoria;
  }

  async excluir(id) {
    await this.buscarPorId(id);
    await CategoriaRepository.excluir(id);
  }
}

module.exports = new CategoriaService();
