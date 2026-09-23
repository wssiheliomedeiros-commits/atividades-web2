const LivroRepository = require("../repositories/LivroRepository");
const AutorRepository = require("../repositories/AutorRepository");
const CategoriaRepository = require("../repositories/CategoriaRepository");
const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["titulo", "isbn", "ano", "disponivel", "autorId"];
const LIMITE_MAXIMO = 100;

function parseBoolean(valor, nome) {
  if (valor === "true") return true;
  if (valor === "false") return false;
  throw new AppError(`O filtro "${nome}" deve ser true ou false`, 400);
}

function parseInteiroPositivo(valor, nome) {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1) {
    throw new AppError(`O parâmetro "${nome}" deve ser um inteiro maior que zero`, 400);
  }
  return numero;
}

class LivroService {
  async criar(dados) {
    const campos = pick(dados, CAMPOS);
    await this.#garantirAutor(campos.autorId);
    const livro = await LivroRepository.criar(campos);
    return this.buscarPorId(livro.id);
  }

  async listar(query = {}) {
    const filtros = {};
    if (query.titulo) filtros.titulo = String(query.titulo);
    if (query.ano !== undefined) filtros.ano = parseInteiroPositivo(query.ano, "ano");
    if (query.disponivel !== undefined) filtros.disponivel = parseBoolean(query.disponivel, "disponivel");

    const paginar = query.page !== undefined || query.limit !== undefined;
    if (!paginar) {
      const { rows } = await LivroRepository.buscarComFiltros(filtros);
      return rows;
    }

    const page = query.page !== undefined ? parseInteiroPositivo(query.page, "page") : 1;
    const limit = query.limit !== undefined ? parseInteiroPositivo(query.limit, "limit") : 10;
    if (limit > LIMITE_MAXIMO) {
      throw new AppError(`O parâmetro "limit" pode ser no máximo ${LIMITE_MAXIMO}`, 400);
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await LivroRepository.buscarComFiltros(filtros, { limit, offset });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async buscarPorId(id) {
    const livro = await LivroRepository.buscarPorId(id);
    if (!livro) throw new AppError("Livro não encontrado", 404);
    return livro;
  }

  async atualizar(id, dados) {
    const campos = pick(dados, CAMPOS);
    await this.buscarPorId(id);
    if (campos.autorId !== undefined) await this.#garantirAutor(campos.autorId);
    await LivroRepository.atualizar(id, campos);
    return this.buscarPorId(id);
  }

  async excluir(id) {
    await this.buscarPorId(id);
    await LivroRepository.excluir(id);
  }

  async associarCategoria(livroId, categoriaId) {
    const livro = await this.buscarPorId(livroId);
    const categoria = await CategoriaRepository.buscarPorId(categoriaId);
    if (!categoria) throw new AppError("Categoria não encontrada", 404);

    await livro.addCategorias([categoria]); 
    return this.buscarPorId(livroId);
  }

  async desassociarCategoria(livroId, categoriaId) {
    const livro = await this.buscarPorId(livroId);
    const categoria = await CategoriaRepository.buscarPorId(categoriaId);
    if (!categoria) throw new AppError("Categoria não encontrada", 404);

    await livro.removeCategorias([categoria]);
    return this.buscarPorId(livroId);
  }

  async #garantirAutor(autorId) {
    if (autorId === undefined) return;
    const autor = await AutorRepository.buscarPorId(autorId);
    if (!autor) throw new AppError("Autor não encontrado", 404);
  }
}

module.exports = new LivroService();
