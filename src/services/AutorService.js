const AutorRepository = require("../repositories/AutorRepository");
const LivroRepository = require("../repositories/LivroRepository");
const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "email", "nacionalidade"];

class AutorService {
  criar(dados) {
    return AutorRepository.criar(pick(dados, CAMPOS));
  }

  listar() {
    return AutorRepository.listar({ order: [["id", "ASC"]] });
  }

  async buscarPorId(id) {
    const autor = await AutorRepository.buscarPorId(id);
    if (!autor) throw new AppError("Autor não encontrado", 404);
    return autor;
  }

  async atualizar(id, dados) {
    const autor = await AutorRepository.atualizar(id, pick(dados, CAMPOS));
    if (!autor) throw new AppError("Autor não encontrado", 404);
    return autor;
  }

  async excluir(id) {
    await this.buscarPorId(id);
    // Regra de negócio: não apagar autor que ainda possui livros.
    const totalLivros = await LivroRepository.contarPorAutor(id);
    if (totalLivros > 0) {
      throw new AppError("Não é possível excluir um autor que possui livros cadastrados", 409);
    }
    await AutorRepository.excluir(id);
  }
}

module.exports = new AutorService();
