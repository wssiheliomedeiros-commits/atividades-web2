const { sequelize } = require("../models");
const EmprestimoRepository = require("../repositories/EmprestimoRepository");
const LivroRepository = require("../repositories/LivroRepository");
const UsuarioRepository = require("../repositories/UsuarioRepository");
const AppError = require("../utils/AppError");

class EmprestimoService {
  listar() {
    return EmprestimoRepository.listar();
  }

  async buscarPorId(id) {
    const emprestimo = await EmprestimoRepository.buscarPorId(id);
    if (!emprestimo) throw new AppError("Empréstimo não encontrado", 404);
    return emprestimo;
  }

  // BEGIN → cria empréstimo → marca livro como indisponível → COMMIT (ou ROLLBACK se der erro).
  async emprestar({ usuarioId, livroId } = {}) {
    if (!usuarioId || !livroId) {
      throw new AppError("usuarioId e livroId são obrigatórios", 400);
    }

    const id = await sequelize.transaction(async (t) => {
      const usuario = await UsuarioRepository.buscarPorId(usuarioId, { transaction: t });
      if (!usuario) throw new AppError("Usuário não encontrado", 404);

      const livro = await LivroRepository.buscarPorId(livroId, { include: [], transaction: t });
      if (!livro) throw new AppError("Livro não encontrado", 404);
      if (!livro.disponivel) throw new AppError("Livro indisponível para empréstimo", 409);

      const emprestimo = await EmprestimoRepository.criar(
        { usuarioId, livroId, dataEmprestimo: new Date(), status: "ativo" },
        { transaction: t }
      );
      await livro.update({ disponivel: false }, { transaction: t });
      return emprestimo.id;
    });

    return this.buscarPorId(id);
  }

  // Devolução: também em transação (empréstimo → devolvido, livro → disponível).
  async devolver(id) {
    await sequelize.transaction(async (t) => {
      const emprestimo = await EmprestimoRepository.buscarPorId(id, { include: [], transaction: t });
      if (!emprestimo) throw new AppError("Empréstimo não encontrado", 404);
      if (emprestimo.status !== "ativo") throw new AppError("Este empréstimo já foi devolvido", 409);

      await emprestimo.update({ status: "devolvido", dataDevolucao: new Date() }, { transaction: t });
      await LivroRepository.atualizar(emprestimo.livroId, { disponivel: true }, { transaction: t });
    });

    return this.buscarPorId(id);
  }
}

module.exports = new EmprestimoService();
